FROM denoland/deno:1.38.4

EXPOSE 8080

WORKDIR /app

USER root
RUN chown -R deno:deno /app
USER deno

ADD src .

COPY deno.json .

RUN deno cache main.ts
RUN deno cache db/config.ts
RUN deno cache core/utils.ts

CMD ["run", "-A", "main.ts"]