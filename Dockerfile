FROM node:alpine as development

RUN mkdir -p /usr/src/app
RUN chmod -R 777 /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENV DATABASE_URL='mongodb+srv://thang16:rP4PvFOyL3WyXmIC@cluster0.zvfxi2n.mongodb.net/tlcn'
ENV jwtSecretKey='a8GxUCo0au5/wNG0lPRA2XOgKJ9W698jVY+MCzK3eeOD40ov/Fs/zUjxtmqLCWL6D3aCYxduOS08ODclxlBWjg=='
ENV jwtRefreshToken='Vdv7hnAwg9XjpfiSvMUd9omsM6HR+DgVPb+KCuloW/Uqk1d0wpwncnbPAioy5J2g5IidM6+S2Xo/7MI+BU0N6w=='
ENV CLIENT_URL='http://localhost:3000'
ENV BACKEND_URL='http://localhost:4000'
ENV HOST_EMAIL=smtp.gmail.com
ENV USER_NAME='nguyenhuuthangc7@gmail.com'
ENV PASSWORD='qzazlqaaozoikcqx'
ENV REDIS_HOST='redis-service'
ENV REDIS_PORT='6379'
ENV WEB3_STORAGE_API_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGFEZDllYTQxYzRkMjAzMjY0MTBEZTVDNURiRWJBRDhGNzRkMTRjMUUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2OTc0MzA0OTY3MTYsIm5hbWUiOiJ0bGNuIn0.Z-V--B0BFhg5De_3WWILX7EbI2eEy-c0qBahdeOt6DU'
ENV AWS_S3_ACCESS_KEY='AKIAY5E4TAHXWW6FDWGM'
ENV AWS_S3_SECRET_KEY='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'
ENV AWS_S3_REGION='ap-southeast-1'
ENV AWS_BUCKET='tlcn-upload'
ENV ORGANIZATION_ID='org-5LLSrr0KdsLdeHGKu7c1UhLu'
ENV OPENAI_API_KEY='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'

RUN npx prisma generate

RUN npm run build

FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN mkdir -p /usr/src/app
RUN chmod -R 777 /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

ENV DATABASE_URL=${DATABASE_URL}
ENV jwtSecretKey=${jwtSecretKey}
ENV jwtRefreshToken=${jwtRefreshToken}
ENV CLIENT_URL=${CLIENT_URL}
ENV BACKEND_URL=${BACKEND_URL}
ENV HOST_EMAIL=${HOST_EMAIL}
ENV USER_NAME=${USER_NAME}
ENV PASSWORD=${PASSWORD}
ENV REDIS_HOST=${REDIS_HOST}
ENV REDIS_PORT=${REDIS_PORT}
ENV WEB3_STORAGE_API_KEY=${WEB3_STORAGE_API_KEY}
ENV AWS_S3_ACCESS_KEY=${AWS_S3_ACCESS_KEY}
ENV AWS_S3_SECRET_KEY=${AWS_S3_SECRET_KEY}
ENV AWS_S3_REGION=${AWS_S3_REGION}
ENV AWS_BUCKET=${AWS_BUCKET}
ENV ORGANIZATION_ID=${ORGANIZATION_ID}
ENV OPENAI_API_KEY=${OPENAI_API_KEY}

RUN npx prisma generate

CMD ["npm", "run", "start:prod"]