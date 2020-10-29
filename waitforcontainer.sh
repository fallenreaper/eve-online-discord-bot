
#!/bin/bash
#waitforcontainer.sh

set -e
host="$1"
shift
cmd="$@"
until PGPASSWORD=password psql -h "$host" -U "postgres" -c '\q'; do
    >&2 echo "Postgres Unavailable. - Sleeping"
    sleep 1
done
>&2 echo "Postgres Up - Executing Command"
exec $cmd
