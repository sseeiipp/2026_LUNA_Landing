FROM nginx:1.27-alpine

# Railway 등은 PORT 환경변수로 포트를 지정한다. 지정이 없으면 80.
ENV PORT=80
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY . /usr/share/nginx/html
