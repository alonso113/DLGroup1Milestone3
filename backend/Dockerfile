# Multi-stage build for Go backend with Python ML

# Stage 1: Build Go binary
FROM golang:1.24-alpine AS go-builder

WORKDIR /app

# Copy go mod files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the Go binary
RUN CGO_ENABLED=0 GOOS=linux go build -o fire-backend main.go

# Stage 2: Runtime with Python and Go binary
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy Go binary from builder
COPY --from=go-builder /app/fire-backend /app/fire-backend

# Copy Firebase credentials directly into image
COPY firebase-credentials.json /app/firebase-credentials.json

# Copy Python ML files and requirements
COPY ml/ /app/ml/

# Install Python dependencies (CPU-only PyTorch to reduce image size)
RUN pip install --no-cache-dir \
    torch --index-url https://download.pytorch.org/whl/cpu && \
    pip install --no-cache-dir \
    transformers>=4.30.0 \
    numpy>=1.24.0 && \
    # Clean up pip cache and unnecessary files
    rm -rf /root/.cache/pip && \
    find /usr/local/lib/python3.11 -type d -name __pycache__ -exec rm -r {} + 2>/dev/null || true

# Copy internal files
COPY internal/ /app/internal/

# Set environment variables
ENV PYTHON_PATH=python3
ENV PORT=8080

# Expose port
EXPOSE 8080

# Run the application
CMD ["/app/fire-backend"]
