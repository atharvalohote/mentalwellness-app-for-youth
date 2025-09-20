import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/designSystem';
import Text from '../ui/Text';

const { width: screenWidth } = Dimensions.get('window');

interface MoodData {
  mood: string;
  emoji: string;
  label: string;
  color: string;
  reason: string;
  timestamp: string;
  date: string;
}

interface MoodPieChartProps {
  moodData: MoodData[];
}

const MoodPieChart: React.FC<MoodPieChartProps> = ({ moodData }) => {
  // Calculate mood counts for the last 7 days
  const getMoodCounts = () => {
    const counts: { [key: string]: { count: number; color: string; emoji: string; label: string } } = {};
    
    moodData.forEach(entry => {
      if (counts[entry.mood]) {
        counts[entry.mood].count++;
      } else {
        counts[entry.mood] = {
          count: 1,
          color: entry.color,
          emoji: entry.emoji,
          label: entry.label,
        };
      }
    });
    
    return counts;
  };

  const moodCounts = getMoodCounts();
  const totalEntries = moodData.length;
  const chartSize = Math.min(screenWidth - (SPACING.lg * 2), 200);

  // Create pie chart segments
  const createPieSegments = () => {
    const segments: Array<{
      mood: string;
      count: number;
      color: string;
      emoji: string;
      label: string;
      percentage: number;
      angle: number;
      startAngle: number;
      endAngle: number;
    }> = [];
    let currentAngle = 0;
    
    Object.entries(moodCounts).forEach(([mood, data]) => {
      const percentage = (data.count / totalEntries) * 100;
      const angle = (data.count / totalEntries) * 360;
      
      if (angle > 0) {
        segments.push({
          mood,
          ...data,
          percentage,
          angle,
          startAngle: currentAngle,
          endAngle: currentAngle + angle,
        });
        currentAngle += angle;
      }
    });
    
    return segments;
  };

  const segments = createPieSegments();

  // Create SVG path for pie segment
  const createPiePath = (startAngle: number, endAngle: number, radius: number) => {
    const centerX = radius;
    const centerY = radius;
    
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;
    
    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);
    
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    
    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  return (
    <View style={styles.container}>
      <Text variant="semibold" size="md" color={COLORS.primaryText} style={styles.title}>
        7-Day Mood Overview
      </Text>
      
      <View style={styles.chartContainer}>
        {/* Pie Chart */}
        <View style={[styles.pieChart, { width: chartSize, height: chartSize }]}>
          {segments.map((segment, index) => (
            <View
              key={segment.mood}
              style={[
                styles.pieSegment,
                {
                  backgroundColor: segment.color,
                  transform: [
                    { rotate: `${segment.startAngle}deg` },
                  ],
                },
              ]}
            >
              <View
                style={[
                  styles.segmentFill,
                  {
                    backgroundColor: segment.color,
                    transform: [{ rotate: `${segment.angle}deg` }],
                  },
                ]}
              />
            </View>
          ))}
          
          {/* Center circle */}
          <View style={[styles.centerCircle, { 
            width: chartSize * 0.4, 
            height: chartSize * 0.4,
            borderRadius: (chartSize * 0.4) / 2,
          }]}>
            <Text variant="bold" size="lg" color={COLORS.primaryText}>
              {totalEntries}
            </Text>
            <Text variant="regular" size="sm" color={COLORS.secondaryText}>
              days
            </Text>
          </View>
        </View>
        
        {/* Legend */}
        <View style={styles.legend}>
          {segments.map((segment) => (
            <View key={segment.mood} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: segment.color }]} />
              <View style={styles.legendText}>
                <Text variant="semibold" size="sm" color={COLORS.primaryText}>
                  {segment.emoji} {segment.label}
                </Text>
                <Text variant="regular" size="xs" color={COLORS.secondaryText}>
                  {segment.count} day{segment.count !== 1 ? 's' : ''} ({segment.percentage.toFixed(0)}%)
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
      
      {moodData.length === 0 && (
        <View style={styles.emptyState}>
          <Text variant="regular" size="sm" color={COLORS.secondaryText} style={styles.emptyText}>
            No mood data available for the last 7 days
          </Text>
          <Text variant="regular" size="xs" color={COLORS.secondaryText} style={styles.emptySubtext}>
            Start logging your daily mood to see your emotional patterns
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.md,
  },
  title: {
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  chartContainer: {
    alignItems: 'center',
  },
  pieChart: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  pieSegment: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 1000,
    overflow: 'hidden',
  },
  segmentFill: {
    position: 'absolute',
    top: 0,
    left: '50%',
    width: '50%',
    height: '100%',
    transformOrigin: '0% 50%',
  },
  centerCircle: {
    backgroundColor: COLORS.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.borderColor,
    zIndex: 10,
  },
  legend: {
    width: '100%',
    maxWidth: 300,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: SPACING.sm,
  },
  legendText: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  emptySubtext: {
    textAlign: 'center',
  },
});

export default MoodPieChart;
