import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Calendar, Tag, Star, Save, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import type { DailyLog, Username } from '@/lib/supabase';
import { useDailyLogs } from '@/hooks/useDailyLogs';
import { toast } from 'sonner';

const logSchema = z.object({
  description: z.string().min(10, 'Description must be at least 10 characters'),
  tags: z.array(z.string()).default([]),
  effort_level: z.number().min(1).max(5).nullable(),
});

type LogFormData = z.infer<typeof logSchema>;

interface DailyLogFormProps {
  username: Username;
  existingLog?: DailyLog;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

const commonTags = [
  'Arrays', 'Strings', 'Linked Lists', 'Trees', 'Graphs', 'DP', 
  'Binary Search', 'Sorting', 'Hash Tables', 'Stack', 'Queue',
  'Recursion', 'Greedy', 'Two Pointers', 'Sliding Window'
];

export function DailyLogForm({ username, existingLog, trigger, onSuccess }: DailyLogFormProps) {
  const [open, setOpen] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const { createLog, updateLog } = useDailyLogs();

  const form = useForm<LogFormData>({
    resolver: zodResolver(logSchema),
    defaultValues: {
      description: existingLog?.description || '',
      tags: existingLog?.tags || [],
      effort_level: existingLog?.effort_level || 3,
    },
  });

  const watchedTags = form.watch('tags');
  const watchedEffort = form.watch('effort_level');

  const onSubmit = async (data: LogFormData) => {
    try {
      const logData = {
        username,
        date: format(new Date(), 'yyyy-MM-dd'),
        description: data.description,
        tags: data.tags,
        effort_level: data.effort_level,
      };

      if (existingLog) {
        await updateLog(existingLog.id, logData);
        toast.success('Log updated successfully!');
      } else {
        await createLog(logData);
        toast.success('Log created successfully!');
      }

      setOpen(false);
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to save log. Please try again.');
      console.error('Error saving log:', error);
    }
  };

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !watchedTags.includes(trimmedTag)) {
      form.setValue('tags', [...watchedTags, trimmedTag]);
    }
    setTagInput('');
  };

  const removeTag = (tagToRemove: string) => {
    form.setValue('tags', watchedTags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  const defaultTrigger = (
    <Button variant="outline" className="gap-2 rounded-xl">
      <Calendar className="w-4 h-4" />
      {existingLog ? 'Edit Today' : 'Log Today'}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-card border-border backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {existingLog ? 'Edit' : 'Create'} Daily Log
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-foreground text-sm">Date</Label>
              <div className="text-muted-foreground text-sm">
                {format(new Date(), 'EEEE, MMMM d, yyyy')}
              </div>
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">What did you work on today?</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your DSA practice session, problems solved, concepts learned..."
                      className="bg-secondary border-border text-foreground placeholder:text-muted-foreground min-h-24 resize-none rounded-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="effort_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Effort Level: {field.value}/5
                  </FormLabel>
                  <FormControl>
                    <div className="px-2">
                      <Slider
                        min={1}
                        max={5}
                        step={1}
                        value={[field.value || 3]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span>Light</span>
                        <span>Moderate</span>
                        <span>Intense</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <Label className="text-foreground flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tags
              </Label>
              
              <div className="flex flex-wrap gap-2 mb-3">
                <AnimatePresence>
                  {watchedTags.map((tag) => (
                    <motion.div
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 rounded-lg">
                        {tag}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="ml-1 h-4 w-4 p-0 hover:bg-primary/20"
                          onClick={() => removeTag(tag)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground rounded-xl"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addTag(tagInput)}
                  disabled={!tagInput.trim()}
                  className="rounded-xl"
                >
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {commonTags.filter(tag => !watchedTags.includes(tag)).map((tag) => (
                  <Button
                    key={tag}
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => addTag(tag)}
                    className="text-muted-foreground hover:text-foreground hover:bg-secondary h-7 px-2 text-xs rounded-lg"
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
                disabled={form.formState.isSubmitting}
              >
                <Save className="w-4 h-4 mr-2" />
                {form.formState.isSubmitting ? 'Saving...' : existingLog ? 'Update Log' : 'Save Log'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="border-border text-muted-foreground hover:bg-secondary rounded-xl"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}