package com.GoHommies.service.authservice;

import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class AuthRateLimiter {

    private final Map<String, Deque<Long>> hits = new ConcurrentHashMap<>();

    public void check(String key, int maxAttempts, int windowSeconds) {
        long now = Instant.now().toEpochMilli();
        long windowMs = windowSeconds * 1000L;

        Deque<Long> queue = hits.computeIfAbsent(key, k -> new ArrayDeque<>());
        synchronized (queue) {
            while (!queue.isEmpty() && now - queue.peekFirst() > windowMs) {
                queue.pollFirst();
            }

            if (queue.size() >= maxAttempts) {
                throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,
                        "Too many requests. Please try again later.");
            }

            queue.addLast(now);
        }
    }
}
