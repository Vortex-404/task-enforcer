import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Calendar,
  Zap,
  Brain
} from "lucide-react";

interface DashboardProps {
  stats: {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    overdueTasks: number;
    totalFocusTime: number;
    completionRate: number;
  };
}

const Dashboard = ({ stats }: DashboardProps) => {
  return (
    <div className="space-y-6">
      {/* Elite Status Header */}
      <Card className="border-primary/20 bg-gradient-to-r from-card to-primary/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Elite Performance Dashboard</h2>
              <p className="text-muted-foreground">Real-time mission status and performance analytics</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{Math.round(stats.completionRate)}%</div>
              <div className="text-sm text-muted-foreground">Mission Success Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Missions */}
        <Card className="border-border/50 hover:border-primary/50 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <Target className="h-4 w-4 text-primary" />
              <span>Active Missions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTasks}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {stats.inProgressTasks} in progress
            </div>
          </CardContent>
        </Card>

        {/* Completed Tasks */}
        <Card className="border-border/50 hover:border-success/50 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <span>Completed</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.completedTasks}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {stats.completionRate.toFixed(1)}% success rate
            </div>
          </CardContent>
        </Card>

        {/* Focus Time */}
        <Card className="border-border/50 hover:border-accent/50 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <Clock className="h-4 w-4 text-accent" />
              <span>Focus Time</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {Math.round(stats.totalFocusTime)}m
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Elite concentration
            </div>
          </CardContent>
        </Card>

        {/* Overdue Warning */}
        <Card className={`border-border/50 transition-colors ${
          stats.overdueTasks > 0 
            ? 'border-destructive/50 bg-destructive/5' 
            : 'hover:border-primary/50'
        }`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <AlertTriangle className={`h-4 w-4 ${stats.overdueTasks > 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
              <span>Overdue</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.overdueTasks > 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
              {stats.overdueTasks}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {stats.overdueTasks > 0 ? 'Requires attention' : 'On schedule'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Completion Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Performance Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Mission Completion Rate</span>
                <span className="font-medium">{stats.completionRate.toFixed(1)}%</span>
              </div>
              <Progress value={stats.completionRate} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-center p-3 bg-success/10 rounded-lg border border-success/20">
                <div className="text-lg font-bold text-success">{stats.completedTasks}</div>
                <div className="text-xs text-muted-foreground">Victories</div>
              </div>
              <div className="text-center p-3 bg-primary/10 rounded-lg border border-primary/20">
                <div className="text-lg font-bold text-primary">{stats.inProgressTasks}</div>
                <div className="text-xs text-muted-foreground">Active</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Elite Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-accent" />
              <span>Elite Status Indicators</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Elite Badges */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Focus Discipline</span>
                <Badge variant={stats.completionRate >= 80 ? "default" : "secondary"} className="bg-primary">
                  {stats.completionRate >= 80 ? 'ELITE' : 'DEVELOPING'}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Mission Reliability</span>
                <Badge variant={stats.overdueTasks === 0 ? "default" : "destructive"}>
                  {stats.overdueTasks === 0 ? 'PUNCTUAL' : 'NEEDS IMPROVEMENT'}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Activity Level</span>
                <Badge variant={stats.totalTasks >= 5 ? "default" : "secondary"} className="bg-accent text-accent-foreground">
                  {stats.totalTasks >= 5 ? 'ACTIVE' : 'BUILDING'}
                </Badge>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="pt-3 border-t border-border">
              <div className="text-xs text-muted-foreground space-y-1">
                <div>• Total focus time: {Math.round(stats.totalFocusTime)} minutes</div>
                <div>• Average per mission: {stats.totalTasks > 0 ? Math.round(stats.totalFocusTime / stats.totalTasks) : 0}m</div>
                <div>• Elite threshold: 80% completion rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Suggestion */}
      {(stats.overdueTasks > 0 || stats.completionRate < 60) && (
        <Card className="border-warning/50 bg-warning/5">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Brain className="h-5 w-5 text-warning mt-0.5" />
              <div>
                <div className="font-medium text-warning mb-1">AI PERFORMANCE ADVISOR</div>
                <p className="text-sm text-muted-foreground">
                  {stats.overdueTasks > 0 && "You have overdue missions requiring immediate attention. "}
                  {stats.completionRate < 60 && "Your completion rate is below elite standards. Consider increasing focus session duration or reviewing task complexity."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;