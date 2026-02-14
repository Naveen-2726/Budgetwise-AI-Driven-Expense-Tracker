import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import api from '../../api/axios';
import { Award, Lock, Trophy } from 'lucide-react';
import { clsx } from 'clsx';
import * as Icons from 'lucide-react';

export default function Achievements() {
    const [achievements, setAchievements] = useState([]);
    const [userAchievements, setUserAchievements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [allRes, userRes] = await Promise.all([
                api.get('/achievements'),
                api.get('/achievements/my')
            ]);
            setAchievements(allRes.data);
            setUserAchievements(userRes.data);
        } catch (error) {
            console.error("Failed to fetch achievements", error);
        } finally {
            setLoading(false);
        }
    };

    const isUnlocked = (achievementId) => {
        return userAchievements.some(ua => ua.achievement.id === achievementId);
    };

    const getIcon = (iconName) => {
        const IconComponent = Icons[iconName] || Award;
        return <IconComponent size={24} />;
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Achievements</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Track your progress and earn badges
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center">
                    <Trophy className="text-yellow-500 mr-2" size={20} />
                    <span className="font-bold text-gray-900 dark:text-white">
                        {userAchievements.length} / {achievements.length} Unlocked
                    </span>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {achievements.map((achievement) => {
                        const unlocked = isUnlocked(achievement.id);
                        return (
                            <Card
                                key={achievement.id}
                                className={clsx(
                                    "relative overflow-hidden transition-all duration-300",
                                    unlocked
                                        ? "border-yellow-200 dark:border-yellow-900/30 bg-gradient-to-br from-white to-yellow-50 dark:from-gray-800 dark:to-yellow-900/10"
                                        : "opacity-70 grayscale"
                                )}
                            >
                                <div className="flex items-start justify-between p-6">
                                    <div className="flex-1">
                                        <div className={clsx(
                                            "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors",
                                            unlocked
                                                ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
                                                : "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500"
                                        )}>
                                            {getIcon(achievement.icon)}
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                            {achievement.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {achievement.description}
                                        </p>
                                    </div>
                                    <div className="mt-1">
                                        {unlocked ? (
                                            <div className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                                Unlocked
                                            </div>
                                        ) : (
                                            <Lock size={20} className="text-gray-300 dark:text-gray-600" />
                                        )}
                                    </div>
                                </div>
                                {unlocked && (
                                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-500"></div>
                                )}
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
