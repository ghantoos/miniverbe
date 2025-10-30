# === Kids Math Trainer Justfile ===

DOCKER_COMMAND := "export DOCKER_UID=$(id -u) && docker compose -f docker/docker-compose.yml"

alias s := start
alias sd := start-detached
alias p := stop
alias r := rebuild
alias c := clean
alias l := logs
alias sh := shell

# Default: list available commands
default:
    just --list

# 🏗️ Build and start the container
@start:
    {{DOCKER_COMMAND}} up --build --remove-orphans

# 🚀 Run detached (background)
@start-detached:
    {{DOCKER_COMMAND}} up -d --build --remove-orphans

# 🛑 Stop containers
@stop:
    {{DOCKER_COMMAND}} down

# 🔄 Force rebuild
@rebuild:
    {{DOCKER_COMMAND}} build --no-cache

# 🧹 Clean up Docker leftovers
@clean:
    docker system prune -f

# 🧭 Show logs
@logs:
    {{DOCKER_COMMAND}} logs -f

# 🧪 Shell into running container
@shell:
    {{DOCKER_COMMAND}} exec math-trainer /bin/sh
