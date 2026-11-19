# Build stage
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Cache Maven wrapper and dependencies
COPY .mvn .mvn
COPY mvnw pom.xml ./
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline -B

# Copy source code and package application jar
COPY src ./src
RUN ./mvnw clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Run as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Copy built jar from build stage
COPY --from=build /app/target/StudyConnect-0.0.1-SNAPSHOT.jar app.jar

# Google Cloud Run provides PORT environment variable (default 8080)
ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
