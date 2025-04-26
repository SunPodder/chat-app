DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd $DIR

bun run build
bunx vite preview --port 5173 --host
