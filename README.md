# Car Marketplace - Fullstack Application

Полнофункциональный автомобильный маркетплейс с современным стеком технологий.

## 🚀 Технологии

### Backend
- **Node.js** + **Express** - серверная платформа
- **PostgreSQL** + **Sequelize ORM** - база данных
- **GraphQL** (Apollo Server) - API для сложных запросов
- **JWT** - авторизация и аутентификация
- **Bcrypt** - хеширование паролей
- **Multer** - загрузка файлов

### Frontend
- **React** + **Vite** - современный фронтенд
- **TailwindCSS** - стилизация
- **Apollo Client** - GraphQL клиент
- **React Router** - маршрутизация
- **React Hook Form** - формы
- **React Hot Toast** - уведомления

### DevOps
- **Docker** + **Docker Compose** - контейнеризация
- **GitHub Actions** - CI/CD
- **ESLint** + **Prettier** - качество кода

## 📁 Структура проекта

```
car-marketplace/
├── backend/                 # Node.js API сервер
│   ├── src/
│   │   ├── controllers/     # Контроллеры
│   │   ├── models/          # Sequelize модели
│   │   ├── routes/          # REST API маршруты
│   │   ├── middleware/      # Middleware функции
│   │   ├── services/        # Бизнес логика
│   │   ├── utils/           # Утилиты
│   │   ├── graphql/         # GraphQL схема и резолверы
│   │   └── config/          # Конфигурация
│   ├── migrations/          # Миграции БД
│   ├── seeders/            # Сиды БД
│   └── uploads/            # Загруженные файлы
├── frontend/               # React приложение
│   ├── src/
│   │   ├── components/     # React компоненты
│   │   ├── pages/          # Страницы
│   │   ├── hooks/          # Кастомные хуки
│   │   ├── services/       # API сервисы
│   │   ├── utils/          # Утилиты
│   │   └── context/        # React контекст
│   └── public/             # Статические файлы
├── .github/workflows/      # GitHub Actions
├── docker-compose.yml      # Docker конфигурация
└── README.md              # Документация
```

## 🚀 Быстрый старт

### Предварительные требования
- Node.js 18+
- PostgreSQL 15+
- Docker (опционально)

### 1. Клонирование репозитория
```bash
git clone <repository-url>
cd car-marketplace
```

### 2. Установка зависимостей
```bash
# Установка корневых зависимостей
npm install

# Установка зависимостей backend
cd backend
npm install

# Установка зависимостей frontend
cd ../frontend
npm install
```

### 3. Настройка базы данных
```bash
# Создание базы данных PostgreSQL
createdb car_marketplace

# Настройка переменных окружения
cp backend/env.example backend/.env
# Отредактируйте backend/.env с вашими настройками БД
```

### 4. Запуск миграций
```bash
cd backend
npm run migrate
npm run seed
```

### 5. Запуск приложения

#### Локальная разработка
```bash
# Запуск backend (порт 5000)
cd backend
npm run dev

# Запуск frontend (порт 3000)
cd ../frontend
npm run dev
```

#### С помощью Docker
```bash
# Запуск всех сервисов
docker-compose up -d

# Просмотр логов
docker-compose logs -f
```

## 🌐 Доступ к приложению

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **GraphQL Playground**: http://localhost:5000/graphql

## 👥 Роли пользователей

- **Admin** - полный доступ ко всем функциям
- **Seller** - может создавать и управлять своими объявлениями
- **Buyer** - может просматривать автомобили и добавлять в избранное

## 📚 API Документация

### REST API Endpoints

#### Аутентификация
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `POST /api/auth/logout` - Выход
- `GET /api/auth/me` - Получить текущего пользователя

#### Пользователи
- `GET /api/users` - Список пользователей (admin)
- `GET /api/users/:id` - Получить пользователя
- `PUT /api/users/:id` - Обновить пользователя
- `DELETE /api/users/:id` - Удалить пользователя (admin)

#### Автомобили
- `GET /api/cars` - Список автомобилей
- `GET /api/cars/:id` - Получить автомобиль
- `POST /api/cars` - Создать автомобиль (seller/admin)
- `PUT /api/cars/:id` - Обновить автомобиль (owner/admin)
- `DELETE /api/cars/:id` - Удалить автомобиль (owner/admin)

### GraphQL API

#### Примеры запросов

**Получить все автомобили:**
```graphql
query GetAllCars {
  cars {
    cars {
      id
      brand
      model
      year
      price
      mileage
      fuelType
      transmission
      images
      seller {
        id
        name
        email
      }
      createdAt
    }
    pagination {
      currentPage
      totalPages
      totalItems
    }
  }
}
```

**Фильтрация автомобилей:**
```graphql
query GetFilteredCars($filters: CarFiltersInput) {
  cars(filters: $filters) {
    cars {
      id
      brand
      model
      year
      price
      mileage
      fuelType
      transmission
      images
      seller {
        name
      }
    }
  }
}
```

**Переменные для фильтрации:**
```json
{
  "filters": {
    "brand": "Toyota",
    "minPrice": 10000,
    "maxPrice": 50000,
    "minYear": 2015,
    "fuelType": "GASOLINE",
    "transmission": "AUTOMATIC"
  }
}
```

**Мутация создания автомобиля:**
```graphql
mutation CreateCar($input: CreateCarInput!) {
  createCar(input: $input) {
    id
    brand
    model
    year
    price
    mileage
    fuelType
    transmission
    images
    seller {
      name
    }
  }
}
```

## 🛠️ Разработка

### Backend разработка
```bash
cd backend
npm run dev          # Запуск в режиме разработки
npm run test         # Запуск тестов
npm run lint         # Проверка кода
npm run migrate      # Запуск миграций
npm run seed         # Заполнение тестовыми данными
```

### Frontend разработка
```bash
cd frontend
npm run dev          # Запуск в режиме разработки
npm run build        # Сборка для продакшена
npm run preview      # Предварительный просмотр сборки
npm run test         # Запуск тестов
npm run lint         # Проверка кода
```

### Общие команды
```bash
npm run dev          # Запуск backend и frontend одновременно
npm run build        # Сборка всего проекта
npm run test         # Запуск всех тестов
npm run lint         # Проверка всего кода
```

## 🐳 Docker

### Сборка и запуск
```bash
# Сборка всех образов
docker-compose build

# Запуск всех сервисов
docker-compose up -d

# Просмотр логов
docker-compose logs -f

# Остановка сервисов
docker-compose down
```

### Пересборка
```bash
# Пересборка без кеша
docker-compose build --no-cache

# Перезапуск конкретного сервиса
docker-compose restart backend
```

## 🔄 CI/CD

Проект настроен с GitHub Actions для автоматического:

- **Линтинга** кода (ESLint)
- **Запуска тестов** (Jest)
- **Сборки** приложения
- **Создания Docker образов**
- **Деплоя** (при пуше в main ветку)

### Workflow файлы
- `.github/workflows/ci-cd.yml` - основной pipeline

## 🧪 Тестирование

### Backend тесты
```bash
cd backend
npm test                    # Запуск всех тестов
npm run test:watch         # Запуск в режиме наблюдения
npm run test:coverage      # Запуск с покрытием
```

### Frontend тесты
```bash
cd frontend
npm test                   # Запуск всех тестов
npm run test:ui           # Запуск с UI
```

## 📊 Мониторинг и логи

### Логи приложения
```bash
# Docker логи
docker-compose logs -f backend
docker-compose logs -f frontend

# Локальные логи
cd backend && npm run dev
cd frontend && npm run dev
```

### Health Check
- Backend: `GET http://localhost:5000/health`
- Frontend: `GET http://localhost:3000`

## 🔒 Безопасность

- **JWT токены** для аутентификации
- **Bcrypt** для хеширования паролей
- **Helmet** для безопасности HTTP заголовков
- **CORS** настройки
- **Rate limiting** для защиты от спама
- **Валидация** входных данных
- **Санитизация** пользовательского ввода

## 🚀 Деплой

### Продакшен переменные окружения

**Backend (.env):**
```env
NODE_ENV=production
PORT=5000
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=car_marketplace_prod
DB_USER=your-db-user
DB_PASSWORD=your-secure-password
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=https://your-frontend-domain.com
```

**Frontend (.env):**
```env
VITE_API_URL=https://your-api-domain.com/api
VITE_GRAPHQL_URL=https://your-api-domain.com/graphql
```

### Рекомендации по деплою

1. **Используйте HTTPS** в продакшене
2. **Настройте CDN** для статических файлов
3. **Используйте managed PostgreSQL** (AWS RDS, Google Cloud SQL)
4. **Настройте мониторинг** (Sentry, DataDog)
5. **Используйте reverse proxy** (Nginx, CloudFlare)

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте feature ветку (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'Add amazing feature'`)
4. Отправьте в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📝 Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](LICENSE) для деталей.

## 📞 Поддержка

Если у вас есть вопросы или проблемы:

1. Проверьте [Issues](https://github.com/your-repo/issues)
2. Создайте новый Issue с подробным описанием
3. Свяжитесь с командой разработки

## 🎯 Roadmap

- [ ] Мобильное приложение (React Native)
- [ ] Система уведомлений (WebSocket)
- [ ] Интеграция с платежными системами
- [ ] Система рейтингов и отзывов
- [ ] Чат между покупателями и продавцами
- [ ] Интеграция с внешними API (автосалоны)
- [ ] Система рекомендаций (ML)
- [ ] Аналитика и дашборды

---

**Создано с ❤️ командой Car Marketplace**