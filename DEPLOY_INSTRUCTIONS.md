# Guia de Deploy - Hostinger VPS (Ubuntu 22.04)

Siga os passos abaixo para implantar a aplicação na sua VPS.

## 1. Acesso à VPS

Acesse sua VPS via SSH:
```bash
ssh root@SEU_IP_DA_VPS
```

## 2. Instalação de Dependências (Docker e Git)

Caso a VPS ainda não tenha o Docker e o Git instalados, execute:

```bash
# Atualizar pacotes
apt update && apt upgrade -y

# Instalar Git e dependências essenciais
apt install -y git curl make

# Instalar Docker (Script oficial)
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Instalar Docker Compose (v2)
apt-get install docker-compose-plugin -y
```

## 3. Clonar o Repositório

```bash
# Vá para o diretório /var/www ou outro de sua preferência
mkdir -p /var/www
cd /var/www

# Clone o repositório do seu projeto (ajuste o link)
git clone https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git jewelry-app
cd jewelry-app
```

## 4. Configurar as Variáveis de Ambiente

Copie o `.env.example` para `.env`:
```bash
cp .env.example .env
```

Edite o arquivo `.env` preenchendo com seus dados reais:
```bash
nano .env
```
**Importante:**
- Altere `POSTGRES_PASSWORD` e `DATABASE_URL` com uma senha forte.
- Defina `NEXTAUTH_URL` para o domínio do seu site (ex: `https://suajoalheria.com`).
- Gere um `NEXTAUTH_SECRET` forte (você pode gerar rodando `openssl rand -base64 32`).
- Adicione as credenciais do Google Calendar API.

## 5. Configurar o Domínio no Nginx e Certbot

No arquivo `nginx/nginx.conf`, substitua `example.com` e `www.example.com` pelo seu domínio real.

Como é a primeira vez que você roda o Let's Encrypt, comente as linhas do SSL no `nginx.conf` primeiro para permitir que o certbot gere o certificado via HTTP. 
(Após rodar o certbot, você as descomenta e reinicia o Nginx).

Para gerar o certificado inicialmente, rode o nginx sem as diretivas ssl, e execute:
```bash
docker compose run --rm certbot certonly --webroot --webroot-path /var/www/certbot/ -d seudominio.com -d www.seudominio.com
```

## 6. Subir os Containers (Build e Deploy)

Com o Makefile incluído no projeto, você pode simplesmente rodar:
```bash
make up
```

Isso fará o build da imagem do Next.js e subirá o banco de dados e o Nginx.

## 7. Rodar as Migrations no Banco de Dados

Para criar as tabelas no PostgreSQL e sincronizar o banco com o schema do Prisma, execute:
```bash
make db-migrate
```

## 8. Logs e Manutenção

- Para ver os logs da aplicação em tempo real: `make logs`
- Para parar a aplicação: `make down`
- Para atualizar a aplicação (após push no git): `make deploy` e depois `make db-migrate`.
