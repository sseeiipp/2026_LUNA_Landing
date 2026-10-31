FROM nginx:1.27-alpine
# Railway 등은 PORT 환경변수로 포트를 지정한다. 지정이 없으면 80.
ENV PORT=80
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY nginx/security-headers.conf /etc/nginx/security-headers.conf
COPY . /usr/share/nginx/html
# css/js 주소에 내용 해시를 붙여 오래 캐시할 수 있게 한다. 서버 설정 파일은 위에서 복사했으니 웹 루트에서는 지운다.
RUN sh /usr/share/nginx/html/nginx/version-assets.sh /usr/share/nginx/html && rm -rf /usr/share/nginx/html/nginx
