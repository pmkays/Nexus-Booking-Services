import * as React from 'react';
import intl from 'react-intl-universal';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IndexNav from '../IndexNav/IndexNav';
import { enUS } from '../../locales/en-US';
import { IAccountReducerState } from '../../reducers/reducer_account';

export interface IProfileProps {
  account: IAccountReducerState;
}

// @ts-ignore
const useStyles = makeStyles(
  createStyles({
    bigAvatar: {
      margin: 10,
      width: 60,
      height: 60,
      borderRadius: 12,
    },
  }),
);

export default function ProfileComponent(props: IProfileProps): JSX.Element {
  // @ts-ignore
  const classes = useStyles();
  return (
    <React.Fragment>
      <IndexNav />
      <Box
        height="100px"
        width="70%"
        marginTop="4px"
        marginBottom="4px"
        margin="auto"
        boxShadow={0}
      >
        <Grid
          container={true}
          spacing={2}
          alignItems="center"
          alignContent="center"
          justify="center"
        >
          <Grid item={true} xl={8} lg={8} md={8}>
            <Typography variant="subtitle1" component="p">
              {intl.get('FIRST_NAME').d(enUS.FIRST_NAME)}: {props.account.firstName}
            </Typography>
            <Typography variant="subtitle1" component="p">
              {intl.get('LAST_NAME').d(enUS.LAST_NAME)}: {props.account.lastName}
            </Typography>
            <Typography variant="subtitle1" component="p">
              {intl.get('EMAIL_ADDRESS').d(enUS.EMAIL_ADDRESS)}: {props.account.email}
            </Typography>
            <Typography variant="subtitle1" component="p">
              {intl.get('PHONE_NUMBER').d(enUS.PHONE_NUMBER)}: {props.account.phoneNo}
            </Typography>
            <Typography variant="subtitle1" component="p">
              {intl.get('ADDRESS').d(enUS.ADDRESS)}: {props.account.address}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </React.Fragment>
  );
}
