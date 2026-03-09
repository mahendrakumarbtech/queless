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
import AssignmentIcon from '@mui/icons-material/Assignment';
import SettingsIcon from '@mui/icons-material/Settings';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useTranslation } from 'react-i18next';
import { usePublicSettings } from '../../context/PublicSettingsContext';

const steps = [
  { key: 'step1', Icon: AssignmentIcon },
  { key: 'step2', Icon: SettingsIcon },
  { key: 'step3', Icon: PlayArrowIcon },
  { key: 'step4', Icon: TrendingUpIcon },
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

const cardShadow = '0 2px 12px rgba(0,0,0,0.08)';
const cardShadowHover = '0 8px 24px rgba(0,0,0,0.12)';

const Home = () => {
  const { t } = useTranslation();
  const { websiteName, websiteLogo } = usePublicSettings();
  const [expandedFaq, setExpandedFaq] = useState(false);

  return (
    <Box sx={{ bgcolor: '#fafafa' }}>
      {/* Hero */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #5a3d8a 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          px: 2,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '50%',
            height: '100%',
            background: 'radial-gradient(circle at 70% 50%, rgba(255,255,255,0.08) 0%, transparent 50%)',
            pointerEvents: 'none',
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          <Grid container alignItems="center" spacing={4}>
            <Grid item xs={12} md={7}>
              <Typography
                variant="h3"
                component="h1"
                fontWeight="700"
                gutterBottom
                sx={{ letterSpacing: '-0.02em', lineHeight: 1.2 }}
              >
                {t('home:heroTitle')}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.95, mb: 4, fontWeight: 400 }}>
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
                    px: 3,
                    py: 1.5,
                    boxShadow: 2,
                    '&:hover': { bgcolor: 'grey.100', boxShadow: 4 },
                  }}
                >
                  {t('home:getStarted')}
                </Button>
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    px: 3,
                    py: 1.5,
                    '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.12)' },
                  }}
                >
                  {t('home:providerLogin')}
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 280,
                  height: 320,
                  borderRadius: 4,
                  bgcolor: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(8px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                }}
              >
                <DashboardIcon sx={{ fontSize: 120, opacity: 0.95 }} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features */}
      <Box id="features" sx={{ py: { xs: 6, md: 10 }, scrollMarginTop: 80 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" textAlign="center" fontWeight="700" gutterBottom sx={{ color: 'grey.900' }}>
            {t('home:featuresTitle')}
          </Typography>
          <Typography color="text.secondary" textAlign="center" sx={{ mb: 6, maxWidth: 560, mx: 'auto' }}>
            {t('home:featuresSubtitle')}
          </Typography>
          <Grid container spacing={3}>
            {features.map(({ titleKey, descKey, Icon }) => (
              <Grid item xs={12} sm={6} md={4} key={titleKey}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    boxShadow: cardShadow,
                    transition: 'box-shadow 0.25s ease, transform 0.25s ease',
                    '&:hover': { boxShadow: cardShadowHover, transform: 'translateY(-4px)' },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        bgcolor: 'primary.main',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                      }}
                    >
                      <Icon sx={{ fontSize: 28 }} />
                    </Box>
                    <Typography variant="h6" fontWeight="600" gutterBottom>
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
      </Box>

      {/* How it works */}
      <Box sx={{ bgcolor: 'white', py: { xs: 6, md: 10 }, boxShadow: '0 -1px 0 rgba(0,0,0,0.06)' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" textAlign="center" fontWeight="700" gutterBottom sx={{ color: 'grey.900' }}>
            {t('home:howItWorksTitle')}
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {steps.map(({ key, Icon }) => (
              <Grid item xs={12} sm={6} md={3} key={key}>
                <Card
                  sx={{
                    textAlign: 'center',
                    py: 3,
                    px: 2,
                    borderRadius: 3,
                    boxShadow: cardShadow,
                    height: '100%',
                    transition: 'box-shadow 0.25s ease',
                    '&:hover': { boxShadow: cardShadowHover },
                  }}
                >
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    <Icon sx={{ fontSize: 32 }} />
                  </Box>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    {t(`home:${key}`)}
                  </Typography>
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
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: '#fafafa' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" textAlign="center" fontWeight="700" gutterBottom sx={{ color: 'grey.900' }}>
            {t('home:industriesTitle')}
          </Typography>
          <Typography color="text.secondary" textAlign="center" sx={{ mb: 5 }}>
            {t('home:industriesSubtitle')}
          </Typography>
          <Grid container spacing={2}>
            {industries.map((key) => (
              <Grid item xs={6} md={4} key={key}>
                <Card
                  variant="outlined"
                  sx={{
                    p: 2.5,
                    textAlign: 'center',
                    borderRadius: 2,
                    borderColor: 'grey.200',
                    '&:hover': { borderColor: 'primary.main', bgcolor: 'white', boxShadow: cardShadow },
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="600">
                    {t(`home:${key}`)}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 6, md: 8 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" fontWeight="700" gutterBottom>
            {t('home:ctaTitle')}
          </Typography>
          <Typography sx={{ mb: 3, opacity: 0.95 }}>{t('home:ctaSubtitle')}</Typography>
          <Button
            component={Link}
            to="/register"
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              px: 4,
              py: 1.5,
              boxShadow: 2,
              '&:hover': { bgcolor: 'grey.100', boxShadow: 4 },
            }}
          >
            {t('home:ctaButton')}
          </Button>
        </Container>
      </Box>

      {/* About */}
      <Box id="about" sx={{ py: { xs: 6, md: 10 }, bgcolor: 'white', scrollMarginTop: 80 }}>
        <Container maxWidth="md">
          <Typography variant="h4" textAlign="center" fontWeight="700" gutterBottom sx={{ color: 'grey.900' }}>
            {t('home:aboutTitle')}
          </Typography>
          <Typography color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
            {t('home:aboutSubtitle')}
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ maxWidth: 640, mx: 'auto' }}>
            {t('home:aboutDesc')}
          </Typography>
        </Container>
      </Box>

      {/* FAQ */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: '#fafafa' }}>
        <Container maxWidth="md">
          <Typography variant="h4" textAlign="center" fontWeight="700" gutterBottom sx={{ color: 'grey.900' }}>
            {t('home:faqTitle')}
          </Typography>
          {faqs.map(({ q, a }, i) => (
            <Accordion
              key={q}
              expanded={expandedFaq === i}
              onChange={() => setExpandedFaq(expandedFaq === i ? false : i)}
              sx={{
                mt: 1,
                borderRadius: '8px !important',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                '&:before': { display: 'none' },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight="600">{t(`home:${q}`)}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">{t(`home:${a}`)}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Container>
      </Box>

      {/* Contact */}
      <Box id="contact" sx={{ py: { xs: 6, md: 10 }, bgcolor: 'white', scrollMarginTop: 80 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" fontWeight="700" gutterBottom sx={{ color: 'grey.900' }}>
            {t('home:contactTitle')}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>{t('home:contactSubtitle')}</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {t('home:contactDesc')}
          </Typography>
          <Button
            component={Link}
            to="/register"
            variant="contained"
            size="large"
            sx={{ px: 4, py: 1.5 }}
          >
            {t('home:getStarted')}
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ bgcolor: 'grey.900', color: 'white', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                {websiteLogo ? (
                  <img src={websiteLogo} alt={websiteName} style={{ maxHeight: 36, objectFit: 'contain' }} />
                ) : null}
                <Typography variant="h6" fontWeight="700">
                  {websiteName}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {t('home:heroSubtitle')}
              </Typography>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle2" fontWeight="700" gutterBottom sx={{ opacity: 0.9 }}>
                {t('home:footerProduct')}
              </Typography>
              <Typography component={Link} to="/#features" variant="body2" display="block" sx={{ color: 'inherit', opacity: 0.8, textDecoration: 'none', '&:hover': { opacity: 1 } }}>
                {t('home:footerFeatures')}
              </Typography>
              <Typography component={Link} to="/" variant="body2" display="block" sx={{ color: 'inherit', opacity: 0.8, textDecoration: 'none', '&:hover': { opacity: 1 } }}>
                {t('home:footerPricing')}
              </Typography>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle2" fontWeight="700" gutterBottom sx={{ opacity: 0.9 }}>
                {t('home:footerCompany')}
              </Typography>
              <Typography component={Link} to="/#about" variant="body2" display="block" sx={{ color: 'inherit', opacity: 0.8, textDecoration: 'none', '&:hover': { opacity: 1 } }}>
                {t('home:footerAbout')}
              </Typography>
              <Typography component={Link} to="/#contact" variant="body2" display="block" sx={{ color: 'inherit', opacity: 0.8, textDecoration: 'none', '&:hover': { opacity: 1 } }}>
                {t('home:footerContact')}
              </Typography>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle2" fontWeight="700" gutterBottom sx={{ opacity: 0.9 }}>
                {t('home:footerSupport')}
              </Typography>
              <Typography component={Link} to="/#features" variant="body2" display="block" sx={{ color: 'inherit', opacity: 0.8, textDecoration: 'none', '&:hover': { opacity: 1 } }}>
                {t('home:footerFaq')}
              </Typography>
              <Typography variant="body2" display="block" sx={{ opacity: 0.8 }}>
                {t('home:footerPrivacy')}
              </Typography>
              <Typography variant="body2" display="block" sx={{ opacity: 0.8 }}>
                {t('home:footerTerms')}
              </Typography>
            </Grid>
          </Grid>
          <Typography variant="body2" sx={{ mt: 5, textAlign: 'center', opacity: 0.7 }}>
            {t('home:footerCopyright', { year: new Date().getFullYear(), name: websiteName || 'QueLess' })}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
