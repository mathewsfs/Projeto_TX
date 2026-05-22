@echo off
set SERVER_IP=147.93.32.113
set SERVER_USER=root
set DEPLOY_FILE=juni-deploy.tar.gz
set REMOTE_DIR=/opt/juni
set STACK_NAME=juni

echo Iniciando o deploy para o servidor Hostinger (%SERVER_IP%)...
echo.
echo ==============================================================
echo 1. Compactando os arquivos do projeto...
echo ==============================================================
tar -czvf %DEPLOY_FILE% --exclude=node_modules --exclude=.git --exclude=.next --exclude=%DEPLOY_FILE% --exclude=juni-app.tar .
if %errorlevel% neq 0 (
    echo Falha ao compactar os arquivos.
    pause
    exit /b %errorlevel%
)

echo.
echo ==============================================================
echo 2. Enviando os arquivos do projeto (%DEPLOY_FILE%)...
echo ATENCAO: Sera solicitada a senha do servidor.
echo A senha fornecida e: Mat041424@#@
echo ==============================================================
scp -o StrictHostKeyChecking=no %DEPLOY_FILE% %SERVER_USER%@%SERVER_IP%:/root/
if %errorlevel% neq 0 (
    echo Falha ao enviar o arquivo.
    del %DEPLOY_FILE%
    pause
    exit /b %errorlevel%
)

echo.
echo ==============================================================
echo 3. Configurando e subindo o Docker no servidor...
echo ATENCAO: Sera solicitada a senha do servidor novamente.
echo A senha fornecida e: Mat041424@#@
echo ==============================================================
ssh -o StrictHostKeyChecking=no %SERVER_USER%@%SERVER_IP% "mkdir -p %REMOTE_DIR% && tar -xzvf /root/%DEPLOY_FILE% -C %REMOTE_DIR%/ && cd %REMOTE_DIR% && docker build -t juni-app:latest . && docker network ls | grep -q fluxora_net || docker network create --driver=overlay --attachable fluxora_net && export POSTGRES_PASSWORD=$(grep ^POSTGRES_PASSWORD= %REMOTE_DIR%/.env | cut -d= -f2) && export POSTGRES_USER=$(grep ^POSTGRES_USER= %REMOTE_DIR%/.env | cut -d= -f2) && export POSTGRES_DB=$(grep ^POSTGRES_DB= %REMOTE_DIR%/.env | cut -d= -f2) && export NEXTAUTH_SECRET=$(grep ^NEXTAUTH_SECRET= %REMOTE_DIR%/.env | cut -d= -f2) && export NEXTAUTH_URL=$(grep ^NEXTAUTH_URL= %REMOTE_DIR%/.env | cut -d= -f2) && export GOOGLE_CLIENT_ID=$(grep ^GOOGLE_CLIENT_ID= %REMOTE_DIR%/.env | cut -d= -f2) && export GOOGLE_CLIENT_SECRET=$(grep ^GOOGLE_CLIENT_SECRET= %REMOTE_DIR%/.env | cut -d= -f2) && docker stack deploy -c %REMOTE_DIR%/docker-compose.swarm.yml %STACK_NAME% && docker service update --force %STACK_NAME%_app && rm /root/%DEPLOY_FILE%"
if %errorlevel% neq 0 (
    echo Falha no deploy remoto.
    del %DEPLOY_FILE%
    pause
    exit /b %errorlevel%
)

echo.
del %DEPLOY_FILE%

echo ==============================================================
echo Deploy concluido! Verifique https://june.fluxora.space
echo O HTTPS e gerido automaticamente pelo Traefik ja configurado.
echo.
echo IMPORTANTE - Primeiro deploy? Execute no servidor:
echo   ssh root@%SERVER_IP%
echo   cd %REMOTE_DIR% ^&^& node prisma/seed-docker.mjs
echo ==============================================================
pause
