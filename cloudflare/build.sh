#!/bin/sh
# Cloudflare Pages 배포용 정리 스크립트. Dockerfile이 하던 일을 그대로 한다.
# 1) 서비스할 파일만 dist/로 복사한다 (원본 사진, 서버 설정, scss 원본, 숨김 파일은 제외).
# 2) css/js 주소 뒤에 내용 해시(?v=...)를 붙인다. 내용이 바뀌면 주소가 바뀌어 브라우저가 새 파일을 받는다.
# 3) 캐시·보안 헤더(_headers)를 넣는다.
# Cloudflare Pages 설정: 빌드 명령 `sh cloudflare/build.sh`, 출력 디렉터리 `dist`
set -e
cd "$(dirname "$0")/.."
rm -rf dist
mkdir dist
for item in *; do
  case "$item" in
    dist|original|nginx|cloudflare|Dockerfile|CNAME|serve.json|wrangler.jsonc) ;;
    *) cp -R "$item" dist/ ;;
  esac
done
find dist \( -name '.*' -o -name '*.scss' -o -name '*.map' \) -type f -exec rm -f {} +
cp cloudflare/_headers dist/_headers
# Cloudflare는 주소의 @를 %40으로 바꾸라고 307 리디렉트를 보낸다. 라이브러리마다 왕복이 한 번 더 생기지 않게 미리 %40으로 적는다.
sed -i -E 's#/vendor/@splinetool/#/vendor/%40splinetool/#g; s#(/vendor/[^"'"'"' ]*)@#\1%40#g' dist/*.html
sh nginx/version-assets.sh dist
echo "dist 준비 완료: $(find dist -type f | wc -l)개 파일"
