# ==============================
# BUILD STAGE
# ==============================

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src

COPY ["expense-tracker.API.csproj", "./"]

RUN dotnet restore "expense-tracker.API.csproj"

COPY . .

RUN dotnet publish "expense-tracker.API.csproj" -c Release -o /app/publish /p:UseAppHost=false


# ==============================
# RUNTIME STAGE
# ==============================

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final

WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080

EXPOSE 8080

ENTRYPOINT ["dotnet", "expense-tracker.API.dll"]