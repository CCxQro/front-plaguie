###
# Runtime-only Dockerfile for the Plaguie frontend.
#
# The Vite build runs in Cloud Build (see cloudbuild.yaml) and produces dist/.
# This image only copies that pre-built output into nginx — no Node.js at runtime.
# Result: ~50 MB image (nginx:alpine) vs ~1 GB if Node were included.
###

FROM nginx:1.27-alpine

ARG APP_VERSION=dev
ENV APP_VERSION=${APP_VERSION}

# Remove the default nginx site
RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist/      /usr/share/nginx/html/

# Cloud Run sends traffic to port 8080 by default
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
