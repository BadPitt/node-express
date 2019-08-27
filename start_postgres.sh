#!/bin/bash

docker run --rm \
	--name data-db \
	-p 5432:5432 \
	-e POSTGRES_PASSWORD=postgres \
	-e POSTGRES_DB=data-db \
	-d \
	timms/postgres-logging:9.6;
