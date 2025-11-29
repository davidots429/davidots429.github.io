---
title: 음료 쇼핑몰
description: 쇼핑몰 구현 프로젝트
date: 2024-11-27
tags: [web, html, java, bootstrap]
---

# 음료 쇼핑몰

쇼핑몰 구현 프로젝트

## 개발 환경

 - **Html**, **Java** : Language
 - **CSS**, **Bootstrap** : Page Design
 - **MariaDB** : DBMS
 - **Spting Boot/Tomcat** : Runtime/server
 - **Eclipse IDE** : Development tool
  
## 개요
간단한 쇼핑몰을 제작해 봄으로써 Spting Boot 사용 경험을 가져보고자 했다.

## 데이터베이스
회원 가입 및 개시글, 댓글 기능 구현을 위해 아래 다이어그램처럼 테이블들을 설계했다.

<td><img src="/images/projects/20241127_shoppingmall_erd.png" alt="bbs-erd" width="500" height="200"></td>

## 설계
다음과 같이 설계했다.

<td><img src="/images/projects/20241127_shoppingmall_system_01.png" alt="bbs-erd" width="500" height="200"></td>

△사용자 측면 시스템 구성도이다.

<br>
<td><img src="/images/projects/20241127_shoppingmall_system_02.png" alt="bbs-erd" width="500" height="200"></td>

△관리자 측면 시스템 구성도이다.

<br>
<td><img src="/images/projects/20241127_shoppingmall_storyboard.png" alt="bbs-erd" width="500" height="200"></td>

△만든 스토리보드 중 한 장이다.

## 구현
설계를 바탕으로 아래와 같이 구현했다.

<td><img src="/images/projects/20241127_shoppingmall_capture_01.png" alt="bbs-erd" width="450" height="200"></td>

△주문 전에 장바구니에 담은 상품을 불러오는 목록이다.

<br>
<td><img src="/images/projects/20241127_shoppingmall_capture_02.png" alt="bbs-erd" width="450" height="200"></td>

△고객 정보를 불러오는 화면이다.

## 결론
 - 간단한 쇼핑몰을 기획하고 설계 및 구현할 수 있다.
 - Spting Boot를 사용하여 웹 사이트를 제작해 봄으로서 웹 MVC구조와 JPA 등의 이해에 도음이 되었다.