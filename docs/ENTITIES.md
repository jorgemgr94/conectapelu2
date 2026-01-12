# ConectaPelu2 - Mapa de Entidades

## Diagrama General

```mermaid
erDiagram
    User ||--o{ OrganizationMember : "pertenece a"
    User ||--o{ AdoptionRequest : "solicita"
    User ||--o{ Notification : "recibe"
    User }o--|| City : "vive en"
    
    Organization ||--o{ OrganizationMember : "tiene"
    Organization ||--o{ Pet : "gestiona"
    Organization ||--o{ Questionnaire : "define"
    Organization ||--o{ DonationMethod : "configura"
    Organization ||--o{ OrganizationServiceArea : "opera en"
    
    OrganizationServiceArea }o--|| City : "ciudad"
    
    Pet ||--o{ PetPhoto : "tiene"
    Pet ||--o{ PetMedicalRecord : "tiene"
    Pet ||--o{ PetStatusLog : "registra"
    Pet ||--o{ SocialPost : "aparece en"
    Pet ||--o{ AdoptionRequest : "recibe"
    Pet ||--o{ FollowUp : "tiene"
    Pet }o--|| City : "se recoge en"
    
    Questionnaire ||--o{ Question : "contiene"
    
    AdoptionRequest ||--o{ RequestAnswer : "tiene"
    AdoptionRequest ||--o| AdoptionContract : "genera"
    
    FollowUp ||--o{ FollowUpPhoto : "tiene"
```

## Geografía

```mermaid
erDiagram
    City {
        uuid id PK
        string name
        string state
        decimal latitude
        decimal longitude
    }
```

### Notas sobre City
- **Datos pre-cargados**: Se cargan ~2,500 municipios de México desde datos oficiales (INEGI)
- **Búsqueda por proximidad**: Las coordenadas permiten calcular distancias entre ciudades
- **Autocompletado**: Los usuarios seleccionan de un dropdown, no escriben libre

---

## Usuarios y Organizaciones

```mermaid
erDiagram
    User {
        uuid id PK
        string email UK
        string passwordHash
        string firstName
        string lastName
        string phone
        string address
        uuid cityId FK "ubicación del usuario"
        enum role "app_admin | user"
        boolean emailVerified
        timestamp createdAt
        timestamp updatedAt
    }
    
    Organization {
        uuid id PK
        string name
        string slug UK
        string description
        string logo
        enum status "pending | active | suspended"
        uuid createdBy FK
        uuid updatedBy FK
        timestamp createdAt
        timestamp updatedAt
    }
    
    OrganizationMember {
        uuid id PK
        uuid userId FK
        uuid organizationId FK
        enum role "org_admin | reviewer | member"
        uuid createdBy FK
        uuid updatedBy FK
        timestamp createdAt
        timestamp updatedAt
    }
    
    OrganizationServiceArea {
        uuid id PK
        uuid organizationId FK
        uuid cityId FK
        uuid createdBy FK
        timestamp createdAt
    }
    
    DonationMethod {
        uuid id PK
        uuid organizationId FK
        string type
        string label
        string url
        boolean isActive
        uuid createdBy FK
        uuid updatedBy FK
        timestamp createdAt
        timestamp updatedAt
    }
    
    User }o--|| City : "vive en"
    User ||--o{ OrganizationMember : "pertenece"
    Organization ||--o{ OrganizationMember : "tiene"
    Organization ||--o{ OrganizationServiceArea : "opera en"
    Organization ||--o{ DonationMethod : "configura"
    OrganizationServiceArea }o--|| City : "ciudad"
```

## Mascotas

```mermaid
erDiagram
    Pet {
        uuid id PK
        uuid organizationId FK
        uuid cityId FK "lugar de recogida"
        string name
        enum species "dog | cat"
        string breed
        date birthDate
        enum sex "male | female | unknown"
        enum size "small | medium | large | extra_large"
        string color
        text description
        text temperament
        enum status "submitted | in_review | active | reserved | adopted | returned | deceased"
        enum origin "rescue | surrender | transfer | born_in_care"
        uuid createdBy FK
        uuid updatedBy FK
        timestamp createdAt
        timestamp updatedAt
    }
    
    PetPhoto {
        uuid id PK
        uuid petId FK
        string url
        boolean isPrimary
        int order
        uuid createdBy FK
        timestamp createdAt
    }
    
    PetMedicalRecord {
        uuid id PK
        uuid petId FK
        enum type "vaccination | deworming | sterilization | surgery | checkup | treatment | other"
        string description
        date date
        string veterinarian
        string attachmentUrl
        uuid createdBy FK
        uuid updatedBy FK
        timestamp createdAt
        timestamp updatedAt
    }
    
    PetStatusLog {
        uuid id PK
        uuid petId FK
        enum status "submitted | in_review | active | reserved | adopted | returned | deceased"
        text notes
        uuid createdBy FK
        timestamp createdAt
    }
    
    SocialPost {
        uuid id PK
        uuid petId FK
        enum platform "facebook | instagram | twitter | tiktok | other"
        string url
        text notes
        uuid createdBy FK
        uuid updatedBy FK
        timestamp createdAt
        timestamp updatedAt
    }
    
    Pet }o--|| City : "se recoge en"
    Pet ||--o{ PetPhoto : "tiene"
    Pet ||--o{ PetMedicalRecord : "tiene"
    Pet ||--o{ PetStatusLog : "registra"
    Pet ||--o{ SocialPost : "aparece"
```

## Proceso de Adopción

```mermaid
erDiagram
    Questionnaire {
        uuid id PK
        uuid organizationId FK
        string name
        text description
        boolean isActive
        uuid createdBy FK
        uuid updatedBy FK
        timestamp createdAt
        timestamp updatedAt
    }
    
    Question {
        uuid id PK
        uuid questionnaireId FK
        string text
        enum type "text | textarea | select | multiselect | boolean | number"
        json options
        boolean isRequired
        int order
        uuid createdBy FK
        uuid updatedBy FK
        timestamp createdAt
        timestamp updatedAt
    }
    
    AdoptionRequest {
        uuid id PK
        uuid petId FK
        uuid questionnaireId FK
        uuid reviewerId FK
        enum status "submitted | in_review | approved | rejected | cancelled | completed"
        text reviewNotes
        text rejectionReason
        uuid createdBy FK
        uuid updatedBy FK
        timestamp createdAt
        timestamp updatedAt
    }
    
    RequestAnswer {
        uuid id PK
        uuid requestId FK
        uuid questionId FK
        text answer
        uuid createdBy FK
        timestamp createdAt
    }
    
    AdoptionContract {
        uuid id PK
        uuid requestId FK
        uuid petId FK
        uuid adopterId FK
        uuid organizationId FK
        text terms
        timestamp signedAt
        text signatureData
        uuid createdBy FK
        timestamp createdAt
    }
    
    Questionnaire ||--o{ Question : "contiene"
    AdoptionRequest ||--o{ RequestAnswer : "tiene"
    AdoptionRequest ||--o| AdoptionContract : "genera"
```

## Seguimiento Post-Adopción

```mermaid
erDiagram
    FollowUp {
        uuid id PK
        uuid petId FK
        uuid adopterId FK
        date scheduledDate
        date completedDate
        enum status "scheduled | pending | completed | overdue"
        text notes
        uuid createdBy FK
        uuid updatedBy FK
        timestamp createdAt
        timestamp updatedAt
    }
    
    FollowUpPhoto {
        uuid id PK
        uuid followUpId FK
        string url
        uuid createdBy FK
        timestamp createdAt
    }
    
    FollowUp ||--o{ FollowUpPhoto : "tiene"
```

## Notificaciones

```mermaid
erDiagram
    Notification {
        uuid id PK
        uuid userId FK
        enum type "adoption_request_received | adoption_request_status_changed | pet_submitted | pet_status_changed | follow_up_reminder | organization_approved | general"
        string title
        text message
        json data
        boolean isRead
        timestamp createdAt
    }
```

## Flujo de Estados

### Estado de Mascota

```mermaid
stateDiagram-v2
    [*] --> submitted: Usuario externo envía
    submitted --> in_review: Org recibe
    in_review --> active: Org aprueba
    in_review --> submitted: Org solicita cambios
    active --> reserved: Solicitud aprobada
    reserved --> adopted: Contrato firmado
    reserved --> active: Adopción cancelada
    adopted --> returned: Devolución
    returned --> active: Disponible de nuevo
    adopted --> [*]: Seguimiento exitoso
    active --> deceased: Fallecimiento
    in_review --> deceased: Fallecimiento
```

### Estado de Solicitud de Adopción

```mermaid
stateDiagram-v2
    [*] --> submitted: Usuario envía
    submitted --> in_review: Reviewer asignado
    in_review --> approved: Evaluación positiva
    in_review --> rejected: Evaluación negativa
    submitted --> cancelled: Usuario cancela
    in_review --> cancelled: Usuario cancela
    approved --> completed: Contrato firmado
    approved --> cancelled: Usuario cancela
    completed --> [*]
    rejected --> [*]
    cancelled --> [*]
```

---

## Listado de Entidades

### Geografía (1 entidad)

| Entidad | Descripción |
|---------|-------------|
| `City` | Ciudades/municipios con coordenadas (datos pre-cargados) |

### Core (6 entidades)

| Entidad | Descripción |
|---------|-------------|
| `User` | Usuarios de la plataforma (todos los tipos) |
| `Organization` | Organizaciones sin fines de lucro |
| `OrganizationMember` | Relación usuario-organización con rol |
| `OrganizationServiceArea` | Ciudades donde opera cada organización |
| `DonationMethod` | Métodos de donación configurados por org |
| `Notification` | Notificaciones para usuarios |

### Mascotas (5 entidades)

| Entidad | Descripción |
|---------|-------------|
| `Pet` | Mascotas (perros/gatos) |
| `PetPhoto` | Fotos de mascotas |
| `PetMedicalRecord` | Historial médico (vacunas, esterilización, etc.) |
| `PetStatusLog` | Historial de cambios de estado |
| `SocialPost` | Posts en redes sociales relacionados a la mascota |

### Adopción (5 entidades)

| Entidad | Descripción |
|---------|-------------|
| `Questionnaire` | Plantilla de cuestionario pre-adopción (por org) |
| `Question` | Preguntas del cuestionario |
| `AdoptionRequest` | Solicitudes de adopción |
| `RequestAnswer` | Respuestas del adoptante a las preguntas |
| `AdoptionContract` | Contrato de adopción firmado |

### Seguimiento (2 entidades)

| Entidad | Descripción |
|---------|-------------|
| `FollowUp` | Seguimientos post-adopción |
| `FollowUpPhoto` | Fotos de seguimiento |

---

## Enums / Tipos

### UserRole (rol global)
- `app_admin` - Administrador de la plataforma
- `user` - Usuario regular (adoptante, etc.)

### OrgMemberRole (rol dentro de org)
- `org_admin` - Administrador de la organización
- `reviewer` - Revisor de solicitudes
- `member` - Miembro básico

### OrganizationStatus
- `pending` - Pendiente de aprobación
- `active` - Activa
- `suspended` - Suspendida

### PetSpecies
- `dog` - Perro
- `cat` - Gato

### PetStatus
- `submitted` - Enviada por usuario externo (pendiente revisión)
- `in_review` - En revisión por la org
- `active` - Activa/publicada (disponible para adopción)
- `reserved` - Reservada (en proceso de adopción)
- `adopted` - Adoptada
- `returned` - Devuelta
- `deceased` - Fallecida

### PetOrigin
- `rescue` - Rescate
- `surrender` - Entrega voluntaria
- `transfer` - Transferencia de otra org
- `born_in_care` - Nacida en cuidado

### PetSize
- `small` - Pequeño
- `medium` - Mediano
- `large` - Grande
- `extra_large` - Extra grande

### PetSex
- `male` - Macho
- `female` - Hembra
- `unknown` - Desconocido

### AdoptionRequestStatus
- `submitted` - Enviada
- `in_review` - En revisión
- `approved` - Aprobada
- `rejected` - Rechazada
- `cancelled` - Cancelada por el usuario
- `completed` - Completada (adoptado)

### QuestionType
- `text` - Texto libre
- `textarea` - Texto largo
- `select` - Selección única
- `multiselect` - Selección múltiple
- `boolean` - Sí/No
- `number` - Número

### MedicalRecordType
- `vaccination` - Vacunación
- `deworming` - Desparasitación
- `sterilization` - Esterilización
- `surgery` - Cirugía
- `checkup` - Chequeo general
- `treatment` - Tratamiento
- `other` - Otro

### FollowUpStatus
- `scheduled` - Programado
- `pending` - Pendiente de respuesta
- `completed` - Completado
- `overdue` - Atrasado

### SocialPlatform
- `facebook` - Facebook
- `instagram` - Instagram
- `twitter` - Twitter/X
- `tiktok` - TikTok
- `other` - Otra

### NotificationType
- `adoption_request_received`
- `adoption_request_status_changed`
- `pet_submitted`
- `pet_status_changed`
- `follow_up_reminder`
- `organization_approved`
- `general`

---

## Total: 19 Entidades

Organizadas para implementación incremental según los milestones del roadmap.
