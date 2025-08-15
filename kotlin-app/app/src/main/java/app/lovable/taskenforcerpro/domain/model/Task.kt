package app.lovable.taskenforcerpro.domain.model

import kotlinx.datetime.Instant
import kotlinx.serialization.Serializable

@Serializable
data class Task(
    val id: String,
    val title: String,
    val description: String? = null,
    val priority: Priority,
    val strictnessLevel: StrictnessLevel,
    val deadline: Instant,
    val estimatedDuration: Int, // in minutes
    val status: TaskStatus,
    val createdAt: Instant,
    val startedAt: Instant? = null,
    val completedAt: Instant? = null,
    val tags: List<String> = emptyList()
)

@Serializable
enum class Priority {
    LOW, MEDIUM, HIGH, CRITICAL
}

@Serializable
enum class StrictnessLevel {
    STANDARD, MILITARY, ELITE, MAXIMUM
}

@Serializable
enum class TaskStatus {
    PENDING, IN_PROGRESS, COMPLETED, FAILED, ABANDONED
}

@Serializable
data class FocusSession(
    val id: String,
    val taskId: String,
    val startTime: Instant,
    val endTime: Instant? = null,
    val duration: Int, // in minutes
    val distractionAttempts: Int = 0,
    val completed: Boolean = false
)