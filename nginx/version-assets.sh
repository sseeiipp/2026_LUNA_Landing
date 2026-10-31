#!/bin/sh
# 배포 때 css/js 주소 뒤에 내용 해시(?v=...)를 붙인다.
# 주소에 ?v=가 있으면 nginx가 1년 동안 캐시하게 하고, 내용이 바뀌면 해시가 바뀌어 바로 새 파일을 받는다.
# db.js를 가져다 쓰는 utils 파일보다 db.js를 먼저 처리해야 utils의 해시에 db.js 변경이 반영된다.
set -e
cd "$1"
for f in js/db.js js/layout.js js/utils.*.js css/style.css; do
  v=$(md5sum "$f" | cut -c1-8)
  pattern=$(echo "$f" | sed 's/\./\\./g')
  sed -i -E "s#(\"|')(\.?/)${pattern}(\"|')#\1\2${f}?v=${v}\3#g" ./*.html js/*.js
done
