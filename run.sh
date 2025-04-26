# check if bun is installed
if ! command -v bun &> /dev/null
then
    echo "bun could not be found, please install bun first"
    exit
fi

docker-compose up & &> /dev/null
sleep 3
./server/run.sh & > /dev/null
./web/run.sh & > /dev/null


# wait for both processes to finish
wait
