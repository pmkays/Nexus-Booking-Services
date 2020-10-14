import React from 'react';
import classes from './Home.module.css';
import image from './images/home.svg';
import Button from '../../components/UI/Button/Button';
import Layout from '../Layout/Layout';

const Home = (props) => {
  const goToBooking = () => {
    props.history.push('/bookings');
  };

  return (
    <Layout>
      <div className={classes.Center}>
        <div className={classes.Cta}>
          <div className='row justify-content-md-center'>
            <div className='col col-lg-6 col-md-12 col-sm-12'>
              <div className={classes.CtaBig}>NEXUS BOOKING SERVICES</div>

              <div className={classes.CtaSmall}>
                Booking For Services Made Easy
              </div>
              <Button clicked={goToBooking} classes={classes.Button}>
                BOOK NOW
              </Button>
              <div className={classes.Content + ' row'}>
                <div className='col col-log-4'>
                  <span className={classes.Stats}>24hr</span>
                  <br />
                  <span className={classes.StatsTag}>RESPONSE</span>
                </div>
                <div className='col col-log-4'>
                  <span className={classes.Stats}>1.3M</span>
                  <br />
                  <span className={classes.StatsTag}>USERS</span>
                </div>
                <div className='col col-log-4'>
                  <span className={classes.Stats}>100%</span>
                  <br />
                  <span className={classes.StatsTag}>MONEY BACK</span>
                </div>
                <div className='col col-log-4'></div>
              </div>
            </div>

            <div className='col col-lg-6 col-md-12 col-sm-12'>
              <img className={classes.Image} src={image} alt='desktop pc' />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
