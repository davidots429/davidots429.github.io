---
title: 품종 기반 와인 추천 모델
description: 품종 기반 와인 추천 모델 제작
date: 2025-06-03
tags: [data, modeling, bert, python]
---

# 품종 기반 와인 추천 모델

품종 기반 와인 추천 모델 제작

- 이 프로젝트는 [WineReco](/projects/web/20250603_winereco)와 연동됩니다.

## BERT

### BERT란?

- Google AI가 2018년 발표한 사전 학습 기반 언어 모델
- 왼쪽 → 오른쪽, 오른쪽 → 왼쪽의 양방향으로 문맥을 이해함.
- Transformer(자연어 처리 인공신경망)의 Encoder만 사용함.
  
### BERT의 학습 방법

- Masked Language Modeling
  * 입력 문장에서 일부 단어를 가리고 이를 예측
  
- Next Sentence Prediction
  * 두 문장이 주어졌을 때, 두 번째 문장이 첫 번째 문장 다음에 실제로 오는지를 예측

## 와인 추천 모델

### 개요
- BERT 기반으로 파인 튜닝
- 13만개의 와인 데이터 사용
- 아무 문장이나 입력 -> 적절한 맛을 가진 포도 품종을 출력

### 데이터 학습 과정

다음과 같은 코드로 데이터를 전처리 하였다.
```python
#필요한 컬럼만 추출하고 결측치 제거
df = df[['description', 'variety']].dropna()
df = df[df['description'].str.strip() != '']
print(df.shape)
print(df['variety'].value_counts().head(10))

#너무 적게 사용된 포도 품종 제거
min_samples = 1000
variety_counts = df['variety'].value_counts()
common_varieties = variety_counts[variety_counts >= min_samples].index

df = df[df['variety'].isin(common_varieties)]
print(f"사용 가능한 포도 품종 수: {df['variety'].nunique()}")
```

<br>
<td><img src="/images/projects/20250430_winebertmodel_barchart.png" alt="bbs-erd" width="400" height="200"></td>

△데이터 전처리 결과를 barchart로 표현.

모델에 학습할 수 있는 형태로 데이터를 바꿔준다.
```python
#라벨 인코딩
label_encoder = LabelEncoder()
df['label'] = label_encoder.fit_transform(df['variety'])

# 나중에 예측 결과를 다시 텍스트로 바꿀 때 사용
id2label = dict(enumerate(label_encoder.classes_))
label2id = {v: k for k, v in id2label.items()}

train_texts, val_texts, train_labels, val_labels = train_test_split(
    df['description'].tolist(),
    df['label'].tolist(),
    test_size=0.1,
    stratify=df['label'],
    random_state=42
)
```
데이터 객체를 선언한 뒤에 DataLoader를 생성하고 옵티마이저 및 러닝 스케줄러를 설정한다.
```python
class WineDataset(Dataset):
    def __init__(self, texts, labels, tokenizer, max_length=128):
        self.texts = texts
        self.labels = labels
        self.tokenizer = tokenizer
        self.max_length = max_length

    def __len__(self):
        return len(self.texts)

    def __getitem__(self, idx):
        text = str(self.texts[idx])
        label = self.labels[idx]

        encoding = self.tokenizer(
            text,
            truncation=True,
            padding='max_length',
            max_length=self.max_length,
            return_tensors='pt'
        )

        return {
            'input_ids': encoding['input_ids'].squeeze(0),
            'attention_mask': encoding['attention_mask'].squeeze(0),
            'label': torch.tensor(label, dtype=torch.long)
        }

# Dataset 객체 생성
train_dataset = WineDataset(train_texts, train_labels, tokenizer)
val_dataset = WineDataset(val_texts, val_labels, tokenizer)

# DataLoader 생성
train_loader = DataLoader(train_dataset, batch_size=16, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=16)

#옵티마이저 및 러닝 스케줄러 설정
optimizer = AdamW(model.parameters(), lr=2e-5)


# total_steps = number of batches * number of epochs
epochs = 3
train_steps_per_epoch = len(train_loader)
total_training_steps = train_steps_per_epoch * epochs


lr_scheduler = get_scheduler(
    name="linear",
    optimizer=optimizer,
    num_warmup_steps=0,
    num_training_steps=total_training_steps,
)
```
그 후에 모델 학습을 진행한다.
```python
#학습 루프 정의
for epoch in range(epochs):
    model.train()
    total_loss = 0
    loop = tqdm(train_loader, desc=f"Epoch {epoch+1}")

    for batch in loop:
        batch = {k: v.to(device) for k, v in batch.items()}

        outputs = model (
            input_ids=batch['input_ids'],
            attention_mask=batch['attention_mask'],
            labels=batch['label']
        )

        loss = outputs.loss
        total_loss += loss.item()

        loss.backward()
        optimizer.step()
        lr_scheduler.step()
        optimizer.zero_grad()

        loop.set_postfix(loss=loss.item())

    avg_loss = total_loss / len(train_loader)
    print(f"\nEpoch {epoch+1} average loss: {avg_loss:.4f}")

#검증

model.eval()
preds, true_labels = [], []

with torch.no_grad():
    for batch in val_loader:
        batch = {k: v.to(device) for k, v in batch.items()}

        outputs = model(
            input_ids=batch['input_ids'],
            attention_mask=batch['attention_mask'],
            labels=batch['label']
        )

        logits = outputs.logits
        predictions = torch.argmax(logits, dim=-1)

        preds.extend(predictions.cpu().numpy())
        true_labels.extend(batch['label'].cpu().numpy())

accuracy = accuracy_score(true_labels, preds)
print(f"Validation Accuracy: {accuracy:.4f}")
```

### 데이터 학습 결과

<br>
<td><img src="/images/projects/20250430_winebertmodel_trainresult.png" alt="bbs-erd" width="900" height="250"></td>

△테스트 결과 및 정확도 스크린 샷.

자연어 모델의 정확도가 76%인 점이 상당히 아쉽지만 모든 입력 데이터의 경우로 정확도를 측정했기 때문에 이정도면 상당히 잘 나왔음을 알 수 있다.

입력 데이터의 상황을 한정시켰으면 수치가 80%에서 85% 정도로 더 높게 나왔을 것 같다.

### 개선점

정확도를 더 높이려면 아래와 같은 방법을 시도해 볼 수 있다.
- Epoch값 증가 (5회 정도로)
- DataLoader 생성시 batch_size 값 증가 (16 -> 32)
- 더 효율적인 데이터 전처리 방식 사용 (sample 최소값 증가시켜서 포도 품종 수 줄이기 등)
  
또한 BERT 대신 더 고성능의 모델인 roBERTa를 사용함으로써 더 정확한 결과를 기대할 수 있다.
