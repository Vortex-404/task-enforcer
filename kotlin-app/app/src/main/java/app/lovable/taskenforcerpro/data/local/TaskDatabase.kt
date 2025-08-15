package app.lovable.taskenforcerpro.data.local

import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import android.content.Context
import app.lovable.taskenforcerpro.data.local.entities.TaskEntity
import app.lovable.taskenforcerpro.data.local.entities.FocusSessionEntity
import app.lovable.taskenforcerpro.data.local.dao.TaskDao
import app.lovable.taskenforcerpro.data.local.dao.FocusSessionDao
import app.lovable.taskenforcerpro.data.local.converters.Converters

@Database(
    entities = [
        TaskEntity::class,
        FocusSessionEntity::class
    ],
    version = 1,
    exportSchema = false
)
@TypeConverters(Converters::class)
abstract class TaskDatabase : RoomDatabase() {
    abstract fun taskDao(): TaskDao
    abstract fun focusSessionDao(): FocusSessionDao

    companion object {
        const val DATABASE_NAME = "task_enforcer_database"
        
        fun create(context: Context): TaskDatabase {
            return Room.databaseBuilder(
                context,
                TaskDatabase::class.java,
                DATABASE_NAME
            )
            .fallbackToDestructiveMigration()
            .build()
        }
    }
}