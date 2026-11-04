/*
 * Copyright 2026 Nathaniel Caldwell
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { createRoot } from 'react-dom/client';

import portfolio from './content/portfolio.json';

import matchforthLogo from './assets/logos/matchforth.png';
import inNeedLogo from './assets/logos/in-need.png';

import githubLogo from './assets/socials/github.svg';
import linkedinLogo from './assets/socials/linkedin.svg';
import facebookLogo from './assets/socials/facebook.svg';

import './styles.css';

// These imports make Vite bundle and fingerprint all image files alongside the React build.
// No separate /portfolio.json fetch or /logos/... URL can point to outdated content.
const APP_LOGOS = {
    'matchforth.png': matchforthLogo,
    'in-need.png': inNeedLogo,
};

const SOCIAL_LOGOS = {
    github: githubLogo,
    linkedin: linkedinLogo,
    facebook: facebookLogo,
};

function Icon({ name, size = 22 }) {
    const paths = {
        email: (
            <>
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <path d="m3 7 9 7 9-7" />
            </>
        ),
        external: (
            <>
                <path d="M13 4h7v7M20 4l-9 9" />
                <path d="M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5" />
            </>
        ),
    };

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {paths[name] || paths.external}
        </svg>
    );
}

function AccessibleLink({ href, className, children, label }) {
    const valid = typeof href === 'string' && /^https?:\/\//i.test(href);

    if (!valid) {
        return (
            <span
                className={`${className} is-placeholder`}
                title="Link not configured"
            >
                {children}
            </span>
        );
    }

    return (
        <a
            className={className}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
        >
            {children}
        </a>
    );
}

function ProjectLogo({ app }) {
    const src = APP_LOGOS[app.logo];

    const initials = app.name
        .split(/\s+/)
        .map((word) => word[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    // The fallback text is visible only when a configured asset
    // is missing or fails to load.
    const [failed, setFailed] = React.useState(false);

    return (
        <span className="app-card__logo">
            {src && !failed ? (
                <img
                    src={src}
                    alt={`${app.name} logo`}
                    loading="eager"
                    onError={() => setFailed(true)}
                />
            ) : (
                <span
                    className="app-card__logo-fallback"
                    aria-label={`${app.name} logo`}
                >
                    {initials}
                </span>
            )}
        </span>
    );
}

function AppCard({ app }) {
    return (
        <AccessibleLink
            href={app.url}
            className="app-card"
            label={`Open ${app.name} in a new tab`}
        >
            <ProjectLogo app={app} />

            <span className="app-card__name">
                {app.name}
            </span>

            <span className="app-card__external">
                <Icon name="external" size={26} />
            </span>
        </AccessibleLink>
    );
}

function Portfolio() {
    const {
        name,
        job_title: jobTitle,
        email,
        socials,
        apps,
    } = portfolio;

    return (
        <div className="portfolio-layout">
            <aside className="sidebar">
                <div className="identity">
                    <h1>{name}</h1>
                    <p>{jobTitle}</p>
                </div>

                <div className="contact">
                    <nav
                        className="socials"
                        aria-label="Social profiles"
                    >
                        {socials.map(({ platform, url }) => (
                            <AccessibleLink
                                key={platform}
                                href={url}
                                className="social-link"
                                label={`Open ${platform}`}
                            >
                                {SOCIAL_LOGOS[platform] ? (
                                    <img
                                        className="social-brand"
                                        src={SOCIAL_LOGOS[platform]}
                                        alt={`${platform} logo`}
                                        width="23"
                                        height="23"
                                    />
                                ) : (
                                    <span className="social-brand__fallback">
                                        {platform}
                                    </span>
                                )}
                            </AccessibleLink>
                        ))}
                    </nav>

                    <a
                        className="email-link"
                        href={`mailto:${email}`}
                    >
                        <Icon name="email" size={24} />
                        <span>{email}</span>
                    </a>
                </div>
            </aside>

            <main
                className="gallery"
                aria-label="Applications"
            >
                <div className="app-list">
                    {apps.map((app) => (
                        <AppCard
                            app={app}
                            key={app.name}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Portfolio />
    </React.StrictMode>
);
