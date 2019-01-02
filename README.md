# Werformace.io

```sh
@"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"

choco install meteor

meteor create <프로젝트명>
```

github에서 pull받은 client, public, server 폴더를 <프로젝트명> 프로젝트 안으로 복사하여 덮어쓰기


### meteor 패키지 설치
```sh
meteor add alexwine:bootstrap-4
meteor add kadira:flow-router
meteor add kadira:blaze-layout
meteor add accounts-password
meteor add themeteorchef:bert
meteor npm install --save bcrypt
meteor add rajit:bootstrap3-datepicker
```

### meteor 실행 및 확인
```sh
meteor
```
localhost:3000에서 결과 확인

## 디렉터리 및 파일 구조
### 전체 디렉터리 구조
| 디렉터리 | 구성요소 |
| ------ | ------ |
| client | 사용자 환경에서 사용되는 디렉터리(사용자에게 보여지는 html파일, css파일 및 이를 제공하기 위해 사용되는 js파일) |
| public | 사용자 및 서버 환경에서 공통적으로 사용되는 디렉터리(이미지, 폰트 등) |
| server | 서버 환경에서 사용되는 디렉터리 |
| imports | 템플릿 이벤트, 템플릿 헬퍼 등 템플릿 구성에 사용되는 기능들로 구성된 디렉터리 |

### 상세 디렉터리 구조
| client | 구성요소 |
| ------ | ------ |
| components | 사용자에게 보여지는 html template 파일의 디렉터리 |
| lib | html 템플릿의 디자인을 구성하는데 사용되는 css파일의 디렉터리 |


| public | 구성요소 |
| ------ | ------ |
| images | 프로젝트 내에서 사용되는 이미지 파일들의 디렉터리 |
| fonts | 프로젝트 내에서 사용되는 폰트들의 디렉터리 |

| server | 구성요소 |
| ------ | ------ |

| imports | 구성요소 |
| ------ | ------ |
| api | 그래프 및 결제 API 기능 수행을 위한 js 파일의 디렉터리 |
| startup | 기본적으로 사용되는 템플릿들의 기능 및 라우터 기능 구현 디렉터리 |

### 상세 디렉터리 구조
| client - components | 구성요소 |
| ------ | ------ |
| account | 사용자 계정 관련 페이지(로그인, 회원가입, 아이디 찾기, 비밀번호 찾기) |
| myPage | 내 정보 관련 페이지(개인정보 조회 및 수정) |
| analysis | 분석결과 조회 관련 페이지(분석결과 조회, 분석결과 상세보기) |
| 기타 파일 | blaze-layout 기본 구조 파일 및 index 페이지 파일 |

### 파일별 페이지 구성 내용
| client - components - account | 구성요소 |
| ------ | ------ |
| findId.html | 아이디 찾기 페이지 |
| findPW.html | 비밀번호 찾기 페이지 |
| login.html | 로그인 페이지 |
| register.html | 회원가입 페이지 |

| client - components - myPage | 구성요소 |
| ------ | ------ |
| myInfo.html | 개인정보수정전 비밀번호 확인 페이지 |
| modifyMyInfo.html | 개인정보수정 페이지 |

| client - components - analysis | 구성요소 |
| ------ | ------ |
| myAnalysis.html | 분석 결과 리스트 조회 페이지 |
| analysisDetail.html | 분석결과 상세보기 페이지 |

| client - components - 기타 파일 | 구성요소 |
| ------ | ------ |
| defaultTemplate.html | blaze-layout의 root 페이지(모든 html template는 이 파일 안에 배치된다.) |
| index.html | index 페이지 |
| mainFooter.html | 페이지 공통 footer 페이지 |
| mainTopBar.html | 페이지 공통 navigation bar 페이지 |

| imports - startup - client | 구성요소 |
| ------ | ------ |
| accounts.js | 회원가입, 로그인, 로그아웃, 아이디 찾기, 비밀번호 찾기, 개인정보 수정 등 계정정보 관련 기능  |
| routes.js |홈페이지 라우팅 기능 |
