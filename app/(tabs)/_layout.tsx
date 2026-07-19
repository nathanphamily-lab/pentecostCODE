import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { TabBarItem } from '@/components/ui/tab-bar-item';
import type { IconSymbolName } from '@/components/ui/icon-symbol';
import { useTokens } from '@/hooks/use-tokens';

const TABS: { name: string; title: string; icon: IconSymbolName }[] = [
  { name: 'index', title: 'Home', icon: 'house.fill' },
  { name: 'learn', title: 'Learn', icon: 'book.fill' },
  { name: 'practice', title: 'Practice', icon: 'pencil' },
  { name: 'profile', title: 'Profile', icon: 'person.fill' },
  { name: 'settings', title: 'Settings', icon: 'gearshape.fill' },
];

export default function TabLayout() {
  const { nav, colors } = useTokens();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: nav.activeLabelColor,
        tabBarInactiveTintColor: nav.inactiveLabelColor,
        // The pill, label and dot are all drawn by TabBarItem in the icon slot,
        // so the navigator's own label is switched off.
        tabBarShowLabel: false,
        tabBarStyle: {
          height: nav.height,
          ...nav.bar,
        },
        tabBarItemStyle: {
          paddingVertical: 0,
        },
        sceneStyle: {
          backgroundColor: colors.bgFallback,
        },
      }}>
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused }) => (
              <TabBarItem icon={tab.icon} label={tab.title} focused={focused} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
