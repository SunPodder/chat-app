#!/bin/bash

# Docker management script for the chat application

case "$1" in
    "build")
        echo "Building all services..."
        docker-compose build
        ;;
    "up")
        echo "Starting all services..."
        docker-compose up -d
        ;;
    "down")
        echo "Stopping all services..."
        docker-compose down
        ;;
    "logs")
        if [ -n "$2" ]; then
            echo "Showing logs for service: $2"
            docker-compose logs -f "$2"
        else
            echo "Showing logs for all services..."
            docker-compose logs -f
        fi
        ;;
    "restart")
        echo "Restarting all services..."
        docker-compose restart
        ;;
    "clean")
        echo "Cleaning up containers, networks, and volumes..."
        docker-compose down -v
        docker system prune -f
        ;;
    "dev")
        echo "Starting development environment..."
        docker-compose up --build
        ;;
    *)
        echo "Usage: $0 {build|up|down|logs|restart|clean|dev}"
        echo ""
        echo "Commands:"
        echo "  build   - Build all Docker images"
        echo "  up      - Start all services in detached mode"
        echo "  down    - Stop all services"
        echo "  logs    - Show logs (optionally specify service name)"
        echo "  restart - Restart all services"
        echo "  clean   - Clean up all containers, networks, and volumes"
        echo "  dev     - Start development environment with build"
        exit 1
        ;;
esac
