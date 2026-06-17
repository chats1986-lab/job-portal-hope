package com.hope.job.config;

import com.hope.job.jwt.JwtConstant;
import com.hope.job.jwt.JwtUtil;
import org.springframework.cloud.gateway.server.mvc.filter.LoadBalancerFilterFunctions;
import org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions;
import org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.function.RequestPredicates;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerRequest;
import org.springframework.web.servlet.function.ServerResponse;

@Configuration
public class RouteConfig {

    private final JwtUtil jwtUtil;

    public RouteConfig(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Bean
    public RouterFunction<ServerResponse> authRoutes() {
        return GatewayRouterFunctions.route("auth-routes")
                .route(RequestPredicates.path("/auth/**"), HandlerFunctions.http())
                .filter(LoadBalancerFilterFunctions.lb("job-portal-user-service"))
                .build();
    }

    // ============= Admin-only Routes (JWT + Role ADMIN) ====================== //
    @Bean
    public RouterFunction<ServerResponse> adminRoutes() {
        return GatewayRouterFunctions.route("admin-routes")
                .route(RequestPredicates.path("/api/admin/**"), HandlerFunctions.http())
                .filter(LoadBalancerFilterFunctions.lb("job-portal-user-service"))
                .before(this::jwtAuthFilter)
                .before(request -> requireRole(request, "ROLE_ADMIN"))
                .build();
    }

    private ServerRequest requireRole(ServerRequest request, String roleAdmin) {
        String roles = request.headers().firstHeader("X-User-Role");
        if (roles == null || !roles.contains(roleAdmin)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied for role " + roleAdmin);
        }
        return request;
    }

    // ============= Protected Routes (JWT required) ====================== //
    @Bean
    public RouterFunction<ServerResponse> userServiceRoutes() {
        return GatewayRouterFunctions.route("user-service-routes")
                .route(RequestPredicates.path("/api/users/**"), HandlerFunctions.http())
                .filter(LoadBalancerFilterFunctions.lb("job-portal-user-service"))
                .before(this::jwtAuthFilter)
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> companyServiceRoutes() {
        return GatewayRouterFunctions.route("company-service-routes")
                .route(RequestPredicates.path("/api/companies/**"), HandlerFunctions.http())
                .filter(LoadBalancerFilterFunctions.lb("job-portal-company-service"))
                .before(this::jwtAuthFilter)
                .build();
    }

    // Public job routes (no authentication required for browsing)
    @Bean
    public RouterFunction<ServerResponse> publicJobRoutes() {
        return GatewayRouterFunctions.route("public-job-routes")
                .route(RequestPredicates.GET("/api/jobs")
                        .or(RequestPredicates.GET("/api/jobs/**"))
                        .or(RequestPredicates.GET("/api/job-categories"))
                        .or(RequestPredicates.GET("/api/job-categories/**"))
                        .or(RequestPredicates.GET("/api/job-skills"))
                        .or(RequestPredicates.GET("/api/job-skills/**"))
                        .or(RequestPredicates.GET("/api/job-tags"))
                        .or(RequestPredicates.GET("/api/job-tags/**")), HandlerFunctions.http())
                .filter(LoadBalancerFilterFunctions.lb("job-portal-job-service"))
                .build();
    }

    // Authenticated job routes (require JWT for creating/modifying jobs)
    @Bean
    public RouterFunction<ServerResponse> authenticatedJobRoutes() {
        return GatewayRouterFunctions.route("authenticated-job-routes")
                .route(RequestPredicates.path("/api/jobs/**")
                        .or(RequestPredicates.path("/api/job-categories/**"))
                        .or(RequestPredicates.path("/api/job-skills/**"))
                        .or(RequestPredicates.path("/api/job-tags/**")), HandlerFunctions.http())
                .filter(LoadBalancerFilterFunctions.lb("job-portal-job-service"))
                .before(this::jwtAuthFilter)
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> applicationServiceRoutes() {
        return GatewayRouterFunctions.route("application-service-routes")
                .route(RequestPredicates.path("/api/applications/**"), HandlerFunctions.http())
                .filter(LoadBalancerFilterFunctions.lb("job-portal-application-service"))
                .before(this::jwtAuthFilter)
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> resumeServiceRoutes() {
        return GatewayRouterFunctions.route("resume-service-routes")
                .route(RequestPredicates.path("/api/resume/**"), HandlerFunctions.http())
                .filter(LoadBalancerFilterFunctions.lb("job-portal-resume-service"))
                .before(this::jwtAuthFilter)
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> preferenceServiceRoutes() {
        return GatewayRouterFunctions.route("preferences-service-routes")
                .route(RequestPredicates.path("/api/preferences/**"), HandlerFunctions.http())
                .filter(LoadBalancerFilterFunctions.lb("job-portal-preferences"))
                .before(this::jwtAuthFilter)
                .build();
    }

    // =========== Ai Service =========== //
    @Bean
    public RouterFunction<ServerResponse> aiServiceRoutes() {
        return GatewayRouterFunctions.route("ai-service-routes")
                .route(RequestPredicates.path("/api/ai/**"), HandlerFunctions.http())
                .filter(LoadBalancerFilterFunctions.lb("job-portal-ai-service"))
                .before(this::jwtAuthFilter)
                .build();
    }

    // =========== Saved Job =========== //
    @Bean
    public RouterFunction<ServerResponse> savedJobRoutes() {
        return GatewayRouterFunctions.route("saved-job-routes")
                .route(RequestPredicates.POST("/api/jobs/*/save")
                        .or(RequestPredicates.DELETE("/api/jobs/*/unsave")
                                .or(RequestPredicates.GET("/api/jobs/*/is-saved")
                                .or(RequestPredicates.GET("/api/jobs/saved")))),
                        HandlerFunctions.http())
                .filter(LoadBalancerFilterFunctions.lb("job-portal-job-service"))
                .before(this::jwtAuthFilter)
                .build();
    }

    // JWT filter
    public ServerRequest jwtAuthFilter(ServerRequest request) {
        String authHeader = request.headers().firstHeader(JwtConstant.JWT_HEADER);

        if (authHeader == null || !authHeader.startsWith(JwtConstant.TOKEN_PREFIX)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "missing or invalid authorization header");
        }

        String token = authHeader.substring(JwtConstant.TOKEN_PREFIX.length());

        if (!jwtUtil.validateToken(token)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "invalid or expired jwt token");
        }

        String email = jwtUtil.extractEmail(token);
        String authorities = jwtUtil.extractAuthorities(token);
        String userId = jwtUtil.extractUserId(token);

        return ServerRequest.from(request)
                .header("X-User-Id", String.valueOf(userId))
                .header("X-User-Email", String.valueOf(email))
                .header("X-User-Role", String.valueOf(authorities))
                .build();
    }

}
