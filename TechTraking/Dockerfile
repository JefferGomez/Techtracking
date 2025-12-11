FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY pom.xml .
RUN mvn -q -e -B -DskipTests dependency:go-offline

COPY src ./src
RUN mvn -q -e -B -DskipTests package

CMD ["java", "-jar", "target/TechTraking-0.0.1-SNAPSHOT.jar"]
