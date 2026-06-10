import { Clock, Users, ChevronRight, AlertCircle } from 'lucide-react';
import { Link } from 'react-router';

interface MeetingCardProps {
  id: string;
  company: string;
  title: string;
  time: string;
  attendees: string[];
  priority?: 'high' | 'medium' | 'low';
  aiInsight: string;
  logo?: string;
}

export function MeetingCard({
  id,
  company,
  title,
  time,
  attendees,
  priority = 'medium',
  aiInsight,
  logo,
}: MeetingCardProps) {
  const priorityColors = {
    high: 'bg-red-100 text-red-700 border-red-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    low: 'bg-green-100 text-green-700 border-green-200',
  };

  return (
    <Link to={`/meeting/${id}`}>
      <div className="bg-card rounded-xl p-6 border border-border hover:shadow-lg hover:border-primary/30 transition-all group cursor-pointer">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-red-700/10 rounded-lg flex items-center justify-center flex-shrink-0">
            {logo ? (
              <img src={logo} alt={company} className="w-8 h-8 object-contain" />
            ) : (
              <span className="text-primary font-semibold">{company.charAt(0)}</span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <h3 className="font-semibold mb-2">{company}</h3>
                <p className="text-sm text-muted-foreground">{title}</p>
              </div>
              {priority === 'high' && (
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${priorityColors[priority]} flex items-center gap-2`}>
                  <AlertCircle className="w-3 h-3" />
                  High Priority
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{time}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{attendees.length} attendees</span>
              </div>
            </div>

            <div className="p-4 bg-accent rounded-lg border border-red-100">
              <p className="text-sm text-foreground/80">
                <span className="font-medium text-primary">AI Insight: </span>
                {aiInsight}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex -space-x-2">
                {attendees.slice(0, 3).map((attendee, idx) => (
                  <div
                    key={idx}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-red-700/80 border-2 border-white flex items-center justify-center"
                  >
                    <span className="text-white text-xs">{attendee.charAt(0)}</span>
                  </div>
                ))}
                {attendees.length > 3 && (
                  <div className="w-8 h-8 rounded-full bg-muted border-2 border-white flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">+{attendees.length - 3}</span>
                  </div>
                )}
              </div>

              <button className="flex items-center gap-2 text-sm text-primary font-medium group-hover:gap-3 transition-all">
                Open Brief
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
