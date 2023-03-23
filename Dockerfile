FROM node:18.15.0

WORKDIR /app

# Create a non-root user
ARG USERNAME=myuser
ARG USER_UID=3000
ARG USER_GID=$USER_UID
RUN groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME
RUN git config --global user.email "you@example.com"
RUN git config --global user.name "Your Name"

# COPY package*.json ./
# RUN npm install

COPY . .

EXPOSE 3000

# remote container使う際はコメントアウト
# CMD ["npm", "start"]