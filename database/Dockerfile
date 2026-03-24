FROM mysql:latest
ENV MYSQL_ROOT_PASSWORD=root

# /docker-entrypoint-initdb.d is a special folder used by the 
# official MySQL Docker image during startup.

COPY schema.sql /docker-entrypoint-initdb.d/schema.sql
