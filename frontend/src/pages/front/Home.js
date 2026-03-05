import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import QueueIcon from '@mui/icons-material/Queue';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import TvIcon from '@mui/icons-material/Tv';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import { useTranslation } from 'react-i18next';
import { usePublicSettings } from '../../context/PublicSettingsContext';

const steps = [
  { key: 'step1', icon: '📋' },
  { key: 'step2', icon: '⚙️' },
  { key: 'step3', icon: '▶️' },
  { key: 'step4', icon: '📈' },
];

const features = [
  { titleKey: 'feature1Title', descKey: 'feature1Desc', Icon: QueueIcon },
  { titleKey: 'feature2Title', descKey: 'feature2Desc', Icon: EventAvailableIcon },
  { titleKey: 'feature3Title', descKey: 'feature3Desc', Icon: TvIcon },
  { titleKey: 'feature4Title', descKey: 'feature4Desc', Icon: AnalyticsIcon },
  { titleKey: 'feature5Title', descKey: 'feature5Desc', Icon: TouchAppIcon },
  { titleKey: 'feature6Title', descKey: 'feature6Desc', Icon: GroupWorkIcon },
];

const industries = ['industry1', 'industry2', 'industry3', 'industry4', 'industry5', 'industry6'];

const faqs = [
  { q: 'faq1Q', a: 'faq1A' },
  { q: 'faq2Q', a: 'faq2A' },
  { q: 'faq3Q', a: 'faq3A' },
];

const Home = () => {
  const { t } = useTranslation();
  const { websiteName } = usePublicSettings();
  const [expandedFaq, setExpandedFaq] = useState(false);

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {/* Hero */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 6, md: 10 },
          px: 2,
        }}
      >
        <Container maxWidth="lg">
          <Grid container alignItems="center" spacing={4}>
            <Grid item xs={12} md={7}>
              <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
                {t('home:heroTitle')}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.95, mb: 3 }}>
                {t('home:heroSubtitle')}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'grey.100' },
                  }}
                >
                  {t('home:getStarted')}
                </Button>
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  size="large"
                  sx={{ borderColor: 'white', color: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
                >
                  {t('home:providerLogin')}
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'center' }}>
              <Box sx={{ fontSize: '8rem', opacity: 0.9 }}>📱</Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" textAlign="center" fontWeight="bold" gutterBottom>
          {t('home:featuresTitle')}
        </Typography>
        <Typography color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
          {t('home:featuresSubtitle')}
        </Typography>
        <Grid container spacing={3}>
          {features.map(({ titleKey, descKey, Icon }) => (
            <Grid item xs={12} sm={6} md={4} key={titleKey}>
              <Card variant="outlined" sx={{ height: '100%', borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ color: 'primary.main', mb: 1 }}>
                    <Icon sx={{ fontSize: 40 }} />
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {t(`home:${titleKey}`)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t(`home:${descKey}`)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How it works */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" textAlign="center" fontWeight="bold" gutterBottom>
            {t('home:howItWorksTitle')}
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {steps.map(({ key, icon }, i) => (
              <Grid item xs={12} sm={6} md={3} key={key}>
                <Card sx={{ textAlign: 'center', py: 2, borderRadius: 2 }}>
                  <Typography sx={{ fontSize: '2rem', mb: 1 }}>{icon}</Typography>
                  <Typography variant="h6">{t(`home:${key}`)}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t(`home:${key}Desc`)}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Industries */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" textAlign="center" fontWeight="bold" gutterBottom>
          {t('home:industriesTitle')}
        </Typography>
        <Typography color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
          {t('home:industriesSubtitle')}
        </Typography>
        <Grid container spacing={2}>
          {industries.map((key) => (
            <Grid item xs={6} md={4} key={key}>
              <Card variant="outlined" sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                <Typography variant="subtitle1">{t(`home:${key}`)}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA */}
      <Box sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', py: 8 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {t('home:ctaTitle')}
          </Typography>
          <Typography sx={{ mb: 3 }}>{t('home:ctaSubtitle')}</Typography>
          <Button
            component={Link}
            to="/register"
            variant="contained"
            size="large"
            sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
          >
            {t('home:ctaButton')}
          </Button>
        </Container>
      </Box>

      {/* FAQ */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h4" textAlign="center" fontWeight="bold" gutterBottom>
          {t('home:faqTitle')}
        </Typography>
        {faqs.map(({ q, a }, i) => (
          <Accordion
            key={q}
            expanded={expandedFaq === i}
            onChange={() => setExpandedFaq(expandedFaq === i ? false : i)}
            sx={{ mt: 1 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="medium">{t(`home:${q}`)}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color="text.secondary">{t(`home:${a}`)}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>

      {/* Footer */}
      <Box component="footer" sx={{ bgcolor: 'grey.100', py: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {websiteName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('home:heroSubtitle')}
              </Typography>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                {t('home:footerProduct')}
              </Typography>
              <Typography component={Link} to="/" variant="body2" display="block" color="text.secondary" sx={{ textDecoration: 'none' }}>
                {t('home:footerFeatures')}
              </Typography>
              <Typography component={Link} to="/" variant="body2" display="block" color="text.secondary" sx={{ textDecoration: 'none' }}>
                {t('home:footerPricing')}
              </Typography>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                {t('home:footerCompany')}
              </Typography>
              <Typography variant="body2" display="block" color="text.secondary">
                {t('home:footerAbout')}
              </Typography>
              <Typography component={Link} to="/" variant="body2" display="block" color="text.secondary" sx={{ textDecoration: 'none' }}>
                {t('home:footerContact')}
              </Typography>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                {t('home:footerSupport')}
              </Typography>
              <Typography variant="body2" display="block" color="text.secondary">
                {t('home:footerFaq')}
              </Typography>
              <Typography variant="body2" display="block" color="text.secondary">
                {t('home:footerPrivacy')}
              </Typography>
              <Typography variant="body2" display="block" color="text.secondary">
                {t('home:footerTerms')}
              </Typography>
            </Grid>
          </Grid>
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 4 }}>
            {t('home:footerCopyright', { year: new Date().getFullYear(), name: websiteName || 'QueLess' })}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
