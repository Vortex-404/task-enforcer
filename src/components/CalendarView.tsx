import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Task } from "@/types";
import { format, isSameDay } from "date-fns";
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarViewProps {
  tasks: Task[];
  onDateSelect: (date: Date) => void;
  onCreateTask: (date: Date) => void;
}

const CalendarView = ({ tasks, onDateSelect, onCreateTask }: CalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewDate, setViewDate] = useState<Date>(new Date());

  const getTasksForDate = (date: Date) => tasks.filter(task => isSameDay(task.deadline, date));

  const getDateInfo = (date: Date) => {
    const dateTasks = getTasksForDate(date);
    const highPriorityCount = dateTasks.filter(t => t.priority === 'critical' || t.priority === 'high').length;
    const completedCount = dateTasks.filter(t => t.status === 'completed').length;
    
    return {
      total: dateTasks.length,
      highPriority: highPriorityCount,
      completed: completedCount,
      hasOverdue: dateTasks.some(t => t.status !== 'completed' && new Date() > t.deadline)
    };
  };

  const renderDay = (date: Date) => {
    const dateInfo = getDateInfo(date);
    const isToday = isSameDay(date, new Date());
    const isSelected = selectedDate && isSameDay(date, selectedDate);

    return (
      <div
        className={`relative w-full h-full p-1 ${isSelected ? 'bg-primary/10 ring-1 ring-primary rounded-md' : ''} ${isToday ? 'ring-1 ring-primary/40' : ''}`}
      >
        <div className="text-sm">{format(date, 'd')}</div>
        {dateInfo.total > 0 && (
          <div className="absolute bottom-0 right-0 flex gap-1 items-center">
            {dateInfo.hasOverdue && <div className="w-1.5 h-1.5 bg-destructive rounded-full" />}
            {dateInfo.highPriority > 0 && <div className="w-1.5 h-1.5 bg-warning rounded-full" />}
            {dateInfo.completed > 0 && <div className="w-1.5 h-1.5 bg-success rounded-full" />}
          </div>
        )}
        {dateInfo.total > 0 && (
          <div className="absolute top-0 right-0 text-xs bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-[0.65rem]">
            {dateInfo.total}
          </div>
        )}
      </div>
    );
  };

  const selectedDateTasks = getTasksForDate(selectedDate);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              <span>Mission Calendar</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-lg font-medium">
                {format(viewDate, 'MMMM yyyy')}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full pointer-events-auto">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  setSelectedDate(date);
                  onDateSelect(date);
                }
              }}
              month={viewDate}
              onMonthChange={setViewDate}
              components={{
                Day: ({ date }) => (
                  <button
                    className="w-full h-12 hover:bg-glass hover:scale-[1.01] transition-smooth rounded-lg relative"
                    onClick={() => {
                      setSelectedDate(date);
                      onDateSelect(date);
                    }}
                  >
                    {renderDay(date)}
                  </button>
                )
              }}
            />
          </div>

          {/* Calendar Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-destructive rounded-full" />
              <span>Overdue</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-warning rounded-full" />
              <span>High Priority</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-success rounded-full" />
              <span>Completed</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{format(selectedDate, 'MMM dd')}</span>
            <Button
              size="sm"
              onClick={() => onCreateTask(selectedDate)}
              className="deploy-btn"
              // data-redirect can be toggled by parent when redirect will occur
              data-redirect="true"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Task
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDateTasks.length === 0 ? (
            <div className="text-center py-6 text-muted">
              <CalendarIcon className="h-8 w-8 mx-auto mb-2 opacity-60" />
              <p className="text-sm">No missions scheduled</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDateTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 border border-border rounded-xl hover:border-primary/50 transition-smooth shadow-sm"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm">{task.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {task.priority}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted mb-2">
                    {format(task.deadline, 'HH:mm')} • {task.estimatedDuration}m
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={task.status === 'completed' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {task.status}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {task.strictnessLevel}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarView;