import React from 'react';
import { Code, Box, ShieldCheck, Rocket, Activity, Server, Database, Globe, AlertTriangle, CheckCircle2, TrendingUp, BookOpen, Lock, ClipboardCheck } from 'lucide-react';
import { PipelineStage, StageStatus } from './types';

export const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: 'code',
    name: 'Code & Commit',
    description: 'Developer commits code. Pre-commit hooks run secret scanning.',
    icon: <Code size={20} />,
    status: StageStatus.IDLE,
    logs: [],
  },
  {
    id: 'build',
    name: 'Build & SCA',
    description: 'Compile artifacts. Software Composition Analysis checks dependencies.',
    icon: <Box size={20} />,
    status: StageStatus.IDLE,
    logs: [],
  },
  {
    id: 'test',
    name: 'Test (SAST)',
    description: 'Static Analysis Security Testing scans source code for flaws.',
    icon: <ShieldCheck size={20} />,
    status: StageStatus.IDLE,
    logs: [],
  },
  {
    id: 'deploy',
    name: 'Deploy (IaC)',
    description: 'Infrastructure as Code deployment to staging/production clusters.',
    icon: <Rocket size={20} />,
    status: StageStatus.IDLE,
    logs: [],
  },
  {
    id: 'monitor',
    name: 'Monitor (DAST)',
    description: 'Runtime monitoring and Dynamic Analysis.',
    icon: <Activity size={20} />,
    status: StageStatus.IDLE,
    logs: [],
  },
];

export const VULNERABLE_CODE_SNIPPET = `// TODO: Refactor before production
const express = require('express');
const app = express();
const db = require('./db');

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  // VULNERABILITY: SQL Injection (OWASP A03:2021)
  // Directly concatenating user input into query
  const query = "SELECT * FROM users WHERE user = '" + username + "' AND pass = '" + password + "'";
  
  const user = await db.execute(query);
  
  if (user) {
    // VULNERABILITY: Hardcoded Secret (OWASP A07:2021)
    const apiKey = "AIzaSyD-12345-SECRET-KEY"; 
    res.json({ token: apiKey, user });
  } else {
    res.status(401).send('Invalid');
  }
});`;

export const SECURE_CODE_SNIPPET = `const express = require('express');
const app = express();
const db = require('./db');

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  // FIX: Parameterized Query
  // Prevents SQL Injection by separating data from command
  const query = "SELECT * FROM users WHERE user = $1 AND pass = $2";
  
  const user = await db.execute(query, [username, password]);
  
  if (user) {
    // FIX: Environment Variable
    // Secrets managed via Vault or Env Vars
    const apiKey = process.env.API_KEY; 
    res.json({ token: apiKey, user });
  } else {
    res.status(401).send('Invalid');
  }
});`;

export const MOCK_METRICS = Array.from({ length: 20 }, (_, i) => ({
  time: `${10 + i}:00`,
  traffic: Math.floor(Math.random() * 500) + 200,
  threats: Math.floor(Math.random() * 50) + 5,
  latency: Math.floor(Math.random() * 100) + 20,
}));

export const GUIDE_CONTENT = [
  {
    id: 'intro',
    title: 'Introduction',
    icon: <BookOpen size={18} />,
    content: {
      heading: "From Code to Cloud with Confidence",
      subheading: "What is DevSecOps?",
      text: "DevSecOps (Development, Security, and Operations) is an architectural approach that involves automating the integration of security at every phase of the software development lifecycle, from initial design through integration, testing, deployment, and software delivery.",
      points: [
        "It replaces the old model where security was a final gatekeeper.",
        "It emphasizes 'Security as Code'.",
        "It aims to make security everyone's responsibility."
      ]
    }
  },
  {
    id: 'problem',
    title: 'The Problem',
    icon: <AlertTriangle size={18} />,
    content: {
      heading: "The 'Wall of Confusion'",
      subheading: "Traditional DevOps Gaps",
      text: "In traditional models, security checks happened weeks after code was written. This created a bottleneck known as the 'Wall of Confusion' between developers and security teams.",
      points: [
        "High Cost of Repair: Fixing a bug in production costs 100x more than in dev.",
        "Slow Velocity: Security reviews delayed releases by days or weeks.",
        "Reactive Posture: Vulnerabilities were only found after breaches or audits."
      ]
    }
  },
  {
    id: 'solution',
    title: 'The Solution',
    icon: <CheckCircle2 size={18} />,
    content: {
      heading: "Shifting Left",
      subheading: "Proactive Security Integration",
      text: "The solution is to 'Shift Left'—moving security testing to the earliest possible stages of development.",
      points: [
        "Automated SAST/DAST: Tools run on every commit.",
        "Infrastructure as Code (IaC): Security policies defined in Terraform/K8s.",
        "Continuous Feedback: Developers get instant alerts in their IDE."
      ]
    }
  },
  {
    id: 'benefits',
    title: 'Business Benefits',
    icon: <TrendingUp size={18} />,
    content: {
      heading: "ROI & Strategic Value",
      subheading: "Why companies adopt DevSecOps",
      text: "Implementing a robust DevSecOps pipeline is not just about technical security; it drives significant business value.",
      points: [
        "Faster Time-to-Market: Automation removes manual security bottlenecks.",
        "Reduced Costs: Early detection drastically lowers remediation expenses.",
        "Regulatory Compliance: Automated audit trails for GDPR, SOC2, HIPAA.",
        "Brand Trust: Fewer breaches mean higher customer confidence."
      ]
    }
  },
  {
    id: 'standards',
    title: 'Standards (OWASP)',
    icon: <ShieldCheck size={18} />,
    content: {
      heading: "OWASP Top 10 & Best Practices",
      subheading: "Measuring Success",
      text: "We align with industry standards like the OWASP Top 10 to prioritize the most critical web application security risks.",
      points: [
        "A01: Broken Access Control - Enforced via policy checks.",
        "A03: Injection (SQLi/XSS) - Caught by SAST and DAST.",
        "A07: Identification and Authentication Failures - Caught by Integration Tests.",
        "Metrics: We track 'Mean Time to Remediate' (MTTR) and 'Vulnerability Density'."
      ]
    }
  },
  {
    id: 'checklist',
    title: 'Live Checklist',
    icon: <ClipboardCheck size={18} />,
    content: {
      heading: "DevSecOps Maturity Checklist",
      subheading: "Real-time Compliance Tracking",
      text: "This checklist updates in real-time based on your current pipeline simulation status. Ensure all items are checked to achieve a secure maturity level.",
      points: [] // Dynamically rendered
    }
  }
];