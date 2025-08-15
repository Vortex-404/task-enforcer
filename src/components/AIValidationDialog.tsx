import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AIValidation, AIValidationQuestion } from "@/lib/ai";
import { Shield, CheckCircle, XCircle } from "lucide-react";

interface AIValidationDialogProps {
  open: boolean;
  onClose: () => void;
  type: 'completion' | 'streak';
  taskTitle?: string;
  onValidated: (result: any) => void;
}

const AIValidationDialog = ({ open, onClose, type, taskTitle, onValidated }: AIValidationDialogProps) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const questions = AIValidation.getValidationQuestions(type);

  const handleSubmit = async () => {
    setIsValidating(true);
    try {
      const validationResult = type === 'completion' 
        ? await AIValidation.validateTaskCompletion(taskTitle || '', answers)
        : await AIValidation.validateStreak('completion', answers);
      
      setResult(validationResult);
      onValidated(validationResult);
    } catch (error) {
      console.error('Validation failed:', error);
    }
    setIsValidating(false);
  };

  const renderQuestion = (question: AIValidationQuestion) => {
    switch (question.type) {
      case 'text':
        return (
          <Textarea
            value={answers[question.id] || ''}
            onChange={(e) => setAnswers(prev => ({ ...prev, [question.id]: e.target.value }))}
            placeholder="Describe your accomplishment..."
            className="min-h-[80px]"
          />
        );
      case 'scale':
        return (
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map(num => (
              <Button
                key={num}
                variant={answers[question.id] === num.toString() ? "default" : "outline"}
                size="sm"
                onClick={() => setAnswers(prev => ({ ...prev, [question.id]: num.toString() }))}
              >
                {num}
              </Button>
            ))}
          </div>
        );
      case 'multiple_choice':
        return (
          <RadioGroup value={answers[question.id]} onValueChange={(value) => 
            setAnswers(prev => ({ ...prev, [question.id]: value }))
          }>
            {question.options?.map(option => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );
    }
  };

  if (result) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {result.validated ? (
                <CheckCircle className="h-5 w-5 text-success" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive" />
              )}
              <span>Validation {result.validated ? 'Successful' : 'Failed'}</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm">{result.feedback}</p>
            
            {result.recommendations?.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Recommendations:</h4>
                <ul className="text-sm space-y-1">
                  {result.recommendations.map((rec: string, i: number) => (
                    <li key={i} className="flex items-start space-x-1">
                      <span>•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <Button onClick={onClose} className="w-full">
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-primary" />
            <span>Elite Validation Protocol</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {questions.map((question) => (
            <div key={question.id} className="space-y-2">
              <Label className="font-medium">{question.question}</Label>
              {renderQuestion(question)}
            </div>
          ))}
          
          <div className="flex space-x-3">
            <Button 
              onClick={handleSubmit} 
              disabled={isValidating || Object.keys(answers).length < questions.length}
              className="flex-1"
            >
              {isValidating ? 'Validating...' : 'Submit for Validation'}
            </Button>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIValidationDialog;