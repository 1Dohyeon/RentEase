### 1. 폴더

- docs : 문서들 보관(ex. ERD_image)
- server : NestJS 프레임 워크 개발 환경

### 2. 깃허브 규칙

**브랜치**

- main : 배포 브랜치
- hotfix : main 브랜치 버그 수정
- develop : 개발 브랜치(브랜치 중앙 저장소, 테스트 용도)
- feature :
  - #n issue name : issue에 포함된 기능별 브랜치(ex. #1 로그인 기능 구현)
  - feature 브랜치를 나눌 때 develop 브랜치으로부터 나눌 것

**커밋 규칙**

sub

- add : 새로운 개발 환경, 파일 및 새로운 기능을 추가하는 경우
- fetch : 코드를 업데이트 했을 경우
- fix : 버그를 고친 경우
- docs : 문서를 작성 및 수정한 경우
- style : 코드 포맷 변경, 기능 수정 없이 코드의 디자인을 수정했을 경우
- refactor : 코드 리펙토링
- test : 테스트 코드를 추가했을 경우
- design : UI 디자인을 변경했을 경우
- rename : 파일명(or 폴더명)을 변경했을 경우
- remove : 코드 또는 파일을 삭제했을 경우
- comment : 주석을 추가하거나 변경했을 경우
- move : 코드(메서드 등) 또는 파일 및 폴더를 이동했을 경우

body

- 선택 사항
- 부연 설명이 필요할 때 작성

**Pull Request**

feature 브랜치에서 기능 개발이 완료되었다면 바로 merge 하는 것이 아니라 develop 브랜치로 pull request한다. 그 후 검토를 하고 merge를 하며 feature 브랜치는 삭제한다.(develop -> main 시에는 develop 브랜치를 삭제하면 안됨)
