'use client';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import HistoryIcon from '@mui/icons-material/History';
import { useHistoryStore } from '@/lib/store/historyStore';

export default function HistoryPage() {
  const { history, getGroupedHistory, removeEntry, clearHistory } = useHistoryStore();

  const grouped = getGroupedHistory();

  const getBudgetDisplay = (budget: number) => {
    return '₱'.repeat(budget);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (history.length === 0) {
    return (
      <Container maxWidth="md">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            textAlign: 'center',
            gap: 2,
          }}
        >
          <HistoryIcon sx={{ fontSize: 80, color: 'text.disabled' }} />
          <Typography variant="h5" color="text.secondary">
            No Spin History Yet
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Start spinning the wheel to see your history!
          </Typography>
        </Box>
      </Container>
    );
  }

  const renderHistorySection = (title: string, entries: typeof history) => {
    if (entries.length === 0) return null;

    return (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {entries.map((entry) => (
            <Card key={entry.id}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        {formatTime(entry.timestamp)}
                      </Typography>
                      {title === 'Older' && (
                        <Typography variant="caption" color="text.secondary">
                          • {formatDate(entry.timestamp)}
                        </Typography>
                      )}
                    </Box>

                    <Typography variant="h6" component="h2" gutterBottom>
                      {entry.restaurant.name}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                      <Chip label={entry.restaurant.cuisine} size="small" color="secondary" />
                      <Chip
                        label={getBudgetDisplay(entry.restaurant.budget)}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      {entry.restaurant.distance && (
                        <Chip
                          label={`${entry.restaurant.distance.toFixed(1)} km`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>

                    <Typography variant="body2" color="text.secondary">
                      📍 {entry.restaurant.location.address}
                    </Typography>
                  </Box>

                  <IconButton
                    aria-label="remove from history"
                    onClick={() => removeEntry(entry.id)}
                    size="small"
                    sx={{ ml: 1 }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    );
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Typography variant="h4" component="h1" gutterBottom>
              Recent Selections
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {history.length} spin{history.length !== 1 ? 's' : ''} in history
            </Typography>
          </div>
          {history.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={clearHistory}
            >
              Clear All
            </Button>
          )}
        </Box>

        {renderHistorySection('Today', grouped.today)}
        {renderHistorySection('Yesterday', grouped.yesterday)}
        {renderHistorySection('This Week', grouped.thisWeek)}
        {renderHistorySection('Older', grouped.older)}
      </Box>
    </Container>
  );
}
