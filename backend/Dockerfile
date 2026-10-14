# Stage 1: Build application with Maven
FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build production jar skipping tests
RUN mvn clean package -Dmaven.test.skip=true

# Stage 2: Minimal JRE runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy built artifact
COPY --from=build /app/target/*.jar app.jar

# Expose Render default port
EXPOSE 8080
ENV PORT=8080

# Run Spring Boot application
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT} -jar app.jar"]
