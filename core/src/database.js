import { CircuitBreaker } from "./database/CircuitBreaker";
import { elizaLogger } from "./logger";
/**
 * An abstract class representing a database adapter for managing various entities
 * like accounts, memories, actors, goals, and rooms.
 */
export class DatabaseAdapter {
    /**
     * The database instance.
     */
    db;
    /**
     * Circuit breaker instance used to handle fault tolerance and prevent cascading failures.
     * Implements the Circuit Breaker pattern to temporarily disable operations when a failure threshold is reached.
     *
     * The circuit breaker has three states:
     * - CLOSED: Normal operation, requests pass through
     * - OPEN: Failure threshold exceeded, requests are blocked
     * - HALF_OPEN: Testing if service has recovered
     *
     * @protected
     */
    circuitBreaker;
    /**
     * Creates a new DatabaseAdapter instance with optional circuit breaker configuration.
     *
     * @param circuitBreakerConfig - Configuration options for the circuit breaker
     * @param circuitBreakerConfig.failureThreshold - Number of failures before circuit opens (defaults to 5)
     * @param circuitBreakerConfig.resetTimeout - Time in ms before attempting to close circuit (defaults to 60000)
     * @param circuitBreakerConfig.halfOpenMaxAttempts - Number of successful attempts needed to close circuit (defaults to 3)
     */
    constructor(circuitBreakerConfig) {
        this.circuitBreaker = new CircuitBreaker(circuitBreakerConfig);
    }
    /**
     * Executes an operation with circuit breaker protection.
     * @param operation A function that returns a Promise to be executed with circuit breaker protection
     * @param context A string describing the context/operation being performed for logging purposes
     * @returns A Promise that resolves to the result of the operation
     * @throws Will throw an error if the circuit breaker is open or if the operation fails
     * @protected
     */
    async withCircuitBreaker(operation, context) {
        try {
            return await this.circuitBreaker.execute(operation);
        }
        catch (error) {
            elizaLogger.error(`Circuit breaker error in ${context}:`, {
                error: error instanceof Error ? error.message : String(error),
                state: this.circuitBreaker.getState(),
            });
            throw error;
        }
    }
}
