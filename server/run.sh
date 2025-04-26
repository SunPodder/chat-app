DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd $DIR

bun run db:generate &> /dev/null
bun run db:migrate &> /dev/null
bun seed.ts &> /dev/null

bun src/index.ts
