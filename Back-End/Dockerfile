# Usa Java 17 desde OpenJDK
FROM eclipse-temurin:17-jdk-alpine

# Crea carpeta de la app
WORKDIR /app

# Copia el JAR empaquetado (ajusta el nombre si es distinto)
COPY target/*.jar app.jar

# Expone el puerto que usa Spring Boot
EXPOSE 8080

# Arranca la aplicación
ENTRYPOINT ["java","-jar","/app/app.jar" ]
# , "--spring.profiles.active=h2"
