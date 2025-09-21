# Use the official Node.js LTS image
FROM node:lts

# Install pnpm globally
RUN npm install -g pnpm

# Install additional useful tools
RUN apt-get update && apt-get install -y \
    git \
    curl \
    nano \
    vim \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user
ARG USERNAME=node
ARG USER_UID=1000
ARG USER_GID=$USER_UID

# Ensure the node user exists and has the right permissions
RUN groupmod --gid $USER_GID $USERNAME \
    && usermod --uid $USER_UID --gid $USER_GID $USERNAME \
    && chown -R $USER_UID:$USER_GID /home/$USERNAME

# Set the working directory
WORKDIR /workspace

# Change ownership of the workspace to the node user
RUN chown $USERNAME:$USERNAME /workspace

# Switch to non-root user
USER $USERNAME

# Set environment variables
ENV PNPM_HOME="/home/$USERNAME/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV SHELL=/bin/bash

# Install pnpm for the user
RUN pnpm setup

# Set default shell to bash
SHELL ["/bin/bash", "-c"]

# Keep container running
CMD ["sleep", "infinity"]