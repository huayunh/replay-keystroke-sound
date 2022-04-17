import ExperimentSetUp from './ExperimentSetUp';
import EndPage from './EndPage';
import WelcomePageAreTheyTheSame from './areTheyTheSame/WelcomePage';
import WelcomePageWhoTypedIt from './whoTypedIt/WelcomePage';
import ExperimentAreTheyTheSame from './areTheyTheSame/Experiment';
import ExperimentWhoTypedIt from './whoTypedIt/Experiment';

export const PAGES = {
    setup: <ExperimentSetUp />,
    welcome: { areTheyTheSame: <WelcomePageAreTheyTheSame />, whoTypedIt: <WelcomePageWhoTypedIt /> },
    experiment: { areTheyTheSame: <ExperimentAreTheyTheSame />, whoTypedIt: <ExperimentWhoTypedIt /> },
    end: <EndPage />,
};
