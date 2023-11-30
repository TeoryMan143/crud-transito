FROM denoland/deno

EXPOSE 8080

WORKDIR /app

USER root
RUN chown -R deno:deno /app
USER deno

ADD src .

COPY deno.json .

RUN deno cache main.ts

CMD ["run", "--allow-net", "--allow-env", "--allow-read", "main.ts"]