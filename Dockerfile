#FROM azul/zulu-openjdk:17-latest
#VOLUME /tmp
#COPY build/libs/*.jar app.jar

#EXPOSE 8080
#ENTRYPOINT ["java","-jar","/app.jar"]

FROM alpine:3.15

ENV GLIBC_VERSION 2.34-r0

RUN apk update
RUN apk upgrade
RUN apk add ca-certificates
RUN apk add --update curl && \
  curl -Lo /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub && \
  curl -Lo glibc.apk "https://github.com/sgerrand/alpine-pkg-glibc/releases/download/${GLIBC_VERSION}/glibc-${GLIBC_VERSION}.apk" && \
  curl -Lo glibc-bin.apk "https://github.com/sgerrand/alpine-pkg-glibc/releases/download/${GLIBC_VERSION}/glibc-bin-${GLIBC_VERSION}.apk" && \
  apk add glibc-bin.apk glibc.apk && \
  /usr/glibc-compat/sbin/ldconfig /lib /usr/glibc-compat/lib && \
  echo 'hosts: files mdns4_minimal [NOTFOUND=return] dns mdns4' >> /etc/nsswitch.conf && \
  apk del curl && \
  rm -rf glibc.apk glibc-bin.apk /var/cache/apk/*

RUN apk add openjdk17=17.0.8_p7-r0

RUN mkdir -p /service

WORKDIR /service

ADD ./build/libs/*-SNAPSHOT.jar /service/application.jar

RUN echo -e "#!/bin/sh\njava -jar /service/application.jar --spring.profiles.active=dev" > /service/start.sh

RUN chmod +x /service/start.sh

EXPOSE 8080

ENTRYPOINT ["/service/start.sh"]